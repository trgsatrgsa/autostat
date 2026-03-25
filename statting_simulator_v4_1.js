//--- GLOBAL ---//
var MAX_SLOT = 8;
var COUNTER_LIMIT = 20;
var LEVEL_CAP = 1;	//temp value, PHP code will update this using default value or user's profile value
var SMITH_PROF = 0;	//default value. If user logged in, this value will follow the value in their profile
var SUCCESS_CONSTANT = 160;
var MATERIAL = Array('', 'Beast', 'Wood', 'Metal', 'Cloth', 'Medicine', 'Mana');

var myFormula;

var stats = Array();
var equipments = Array();
var lastDelta = Array();

var lastRepeat = 0;

//--- LOADED FROM DB---//

var load_steps;
var load_pot;
var load_ori;
var load_me;
var load_type;

//--- CLASS ---//
function Equipment(id, name, potential) {
	this.id = id;
	this.name = name;
	this.potential = potential;
}

function Stat(id, name, mat_id, pot, mat_base, cheap_limit, multiplier, multiplier2, category, type, negative_ok) {
	this.id = id;
	this.name = name;
	this.mat_id = mat_id;
	this.pot = pot * 1;
	this.mat_base = mat_base * 1;
	this.multiplier = multiplier * 1;
	this.multiplier2 = multiplier2 * 1;
	this.category = category;
	this.type = type;
	this.cheap_limit = cheap_limit * 1;
	this.negative_ok = negative_ok * 1;
}

function Formula(type, potential, original, match_element) {
	this.type = type;
	this.potential = potential * 1;
	this.original = original * 1;
	this.starting_pot = potential * 1;
	this.match_element = match_element;
	this.penalty = 1;
	this.nsteps = 0;
	this.steps = [];
	this.highest_mats = 0;
	this.rate = 100;
	this.use_ori = 0;
	this.done = false;
	$("#table-steps").append("<tr><td colspan='2'><span style='color:navy'><b>Type : </b>" + (this.type == 'A' ? "Armor" : "Weapon") + "</span></td></tr>");
	$("#table-steps").append("<tr><td colspan='2'><span style='color:navy'><b>Original Potential : </b>" + this.original + "</span></td></tr>");
	$("#table-steps").append("<tr><td colspan='2'><span style='color:navy'><b>Starting Potential : </b>" + this.potential + "</span></td></tr>");

	$("#newPot").html(this.potential);
	$("#oldPot").html(this.potential);

	//initialize all slots with 0
	this.stat = [];
	this.val = [];
	this.ctr = [];
	for (i = 0; i < MAX_SLOT; i++) {
		this.stat.push(0);
		this.val.push(0);
		this.ctr.push(0);
	}

	//there are 6 type of mats, ID=1..6
	this.mat = [-1, 0, 0, 0, 0, 0, 0];	//no mats with id=0

	this.successRate = function (deltaPot) {
		if (this.potential >= this.original)
			return Math.trunc(SUCCESS_CONSTANT + 230 * (this.potential + Math.trunc(deltaPot)) / this.potential);
		else {
			this.use_ori = 1;
			return Math.trunc(SUCCESS_CONSTANT + 230 * (this.potential + Math.trunc(deltaPot)) / this.original);
		}
	}

	this.addStat = function (newStat, newVal) {
		var newCtr = [];
		for(var i = 0; i < MAX_SLOT; i++)
			newCtr.push(valToCounter(newVal[i], newStat[i]));
		if (this.done == true) return;

		var deltaPot = 0;
		var result = "";
		var first = 1;
		var currDelta = Array();

		// Calculate current delta stat
		var is_change=0;
		for (var i = 0; i < MAX_SLOT; i++){
			currDelta[i] = newCtr[i] - this.ctr[i];
			if(currDelta[i] != 0)
				is_change = 1;
		}
		if(is_change==0)
			return;

		// Update interface
		for (var i = 0; i < MAX_SLOT; i++) {
			if (this.stat[i] != newStat[i]) {
				$('#slot' + i).fadeOut(0);
				$('#tdSlot' + i).html(stats[newStat[i]].name);
				$('#tdSlot' + i).fadeIn(0);
				this.stat[i] = newStat[i];
			}
		}

		// Calculate penalty
		var arr = [];
		for (var i = 0; i < MAX_SLOT; i++)
			if (this.stat[i] != 0)
				arr.push(stats[this.stat[i]].category);
		arr.sort();
		this.penalty = this.calculatePenalty(arr);

		//	Calculate mats
		var delta_mats = [-1, 0, 0, 0, 0, 0, 0];
		for (var i = 0; i < MAX_SLOT; i++) {
			if (newStat[i] == 0) continue;
			var mats_consumed = calculateMats(this.ctr[i], newCtr[i], newStat[i]);
			var deltaStat = newVal[i] - this.val[i];

			var pot_consumed = this.calculatePot(newStat[i], this.val[i], newVal[i], this.penalty);
			$("#info" + i).html("");

			if (deltaStat != 0) {
				if (first) first = 0;
				else result += ", ";

				if (deltaStat > 0)
					result += stats[newStat[i]].name + " +" + deltaStat;
				else
					result += "<span style='color:red'>" + stats[newStat[i]].name + deltaStat + "</span>";
			}
			this.val[i] = newVal[i];
			this.ctr[i] = newCtr[i];


			delta_mats[stats[newStat[i]].mat_id] += mats_consumed;
			$("#mat" + i).html("");

			deltaPot += pot_consumed;
		}
		// divide by 100 because everything was calculated in x100 amount
		deltaPot /= 100;

		//update mats consumed
		for (var i = 1; i <= 6; i++) {
			if (delta_mats[i] > this.highest_mats)
				this.highest_mats = delta_mats[i];
			this.mat[i] += delta_mats[i];
		}

		//update highest mats
		$("#highest").html(this.highest_mats);

		//show success rate
		this.rate = this.successRate(deltaPot);
		if (this.rate > 100) this.rate = 100;
		if (this.rate < 0) this.rate = 0;

		this.potential += Math.trunc(deltaPot);
		$("#newPot").html(this.potential);
		$("#oldPot").html(this.potential);

		//insert STEPS
		if (result != "") {
			this.steps.push(newStat);
			this.steps.push(newVal);

			if (JSON.stringify(currDelta) == JSON.stringify(lastDelta)) {
				lastRepeat++;
				$('#step' + (this.nsteps - 1)).html('x' + lastRepeat);
			}
			else {
				lastDelta = currDelta;
				lastRepeat = 1;
				$("#table-steps").append("<tr><td><b>STEP #" + (this.nsteps+1) + ": </b>" + result + "</td><td id='step" + this.nsteps + "'>x1</td></tr>");
				this.nsteps++;
			}
		}

		//update MATERIAL
		for (var i = 1; i <= 6; i++)
			$("#totalMat" + i).html(this.mat[i] + " pts");

		//check "DONE"
		var ctr = 0;
		for (var i = 0; i < MAX_SLOT; i++)
			if (this.stat[i] > 0) ctr++;
		if (this.potential <= 0 || ctr == MAX_SLOT) {
			$("#btn-confirm").attr("disabled", "disabled");
			$("#btn-confirm").html("FINISHED");
			$("#btn-repeatlast").attr("disabled", "disabled");
			$("#table-steps").append("<tr><td colspan='2'><b>Success rate: " + this.rate + "%</b></td></tr>");

			for (var i = 0; i < MAX_SLOT; i++)
				$("#slot" + i).attr("disabled", "disabled");
			$("#value" + i).attr("disabled", "disabled");

			this.done = true;
		}
	}

	this.tryStat = function (newStat, newVal) {
		var newCtr = [];
		for(var i = 0; i < MAX_SLOT; i++)
			newCtr.push(valToCounter(newVal[i], newStat[i]));
		var deltaPot = 0;

		// Update stat slots & penalty
		var arr = [];
		for (var i = 0; i < MAX_SLOT; i++) {
			if (newStat[i] == 0) continue;
			if (this.stat[i] != newStat[i])
				arr.push(stats[newStat[i]].category);
			else
				arr.push(stats[this.stat[i]].category);
		}
		arr.sort();
		var penalty = this.calculatePenalty(arr);

		for (var i = 0; i < MAX_SLOT; i++) {
			if (newStat[i] != 0) {
				var mats_consumed = calculateMats(this.ctr[i], newCtr[i], newStat[i]);
				var deltaStat = newVal[i] - this.val[i];

				var pot_consumed = this.calculatePot(newStat[i], this.val[i], newVal[i], penalty);

				//update interface
				if (deltaStat < 0) $("#info" + i).html("(" + deltaStat + ")");
				else if (deltaStat > 0) $("#info" + i).html("(+" + deltaStat + ")");
				else {
					$("#info" + i).html("");
					$("#mat" + i).html("");
				}

				if (mats_consumed != 0)
					$("#mat" + i).html(mats_consumed + " x " + MATERIAL[stats[newStat[i]].mat_id]);

				deltaPot += pot_consumed;
			}
		}
		// divide by 100 because penalty was calculated in x100 amount
		deltaPot /= 100;

		//show remaining potential
		$("#newPot").html(this.potential + Math.trunc(deltaPot));

		//show success rate
		var tempRate = this.successRate(deltaPot);
		if (tempRate >= 100)
			$("#success").html("100%");
		else if (tempRate < 0)
			$("#success").html("0%");
		else
			$("#success").html(tempRate + "%");

	}

	this.calculatePot = function (idStat, start, end, penalty) {
		start = valToCounter(start, idStat);
		end = valToCounter(end, idStat);
		var stat_data = stats[idStat];
		var soft_limit = [COUNTER_LIMIT, 100 / stat_data.pot, stat_data.cheap_limit / stat_data.multiplier].sort((a, b) => a - b)[0]; // limit for regular potential cost
		var outliers = 0, diff = 0;
		var [min, max] = [start, end].sort((a, b) => a - b);

		diff = max - min;
		if (Math.abs(min) > soft_limit) {
			var change = Math.abs(min) - soft_limit;
			outliers += change;
			diff -= change;
		}
		if (Math.abs(max) > soft_limit) {
			var change = Math.abs(max) - soft_limit;
			outliers += change;
			diff -= change;
		}
		if (diff < 0) {
			outliers += diff;
			diff = 0;
		}

		var multiplier = 1;
		if ((stats[idStat].type == 'A' && this.type == 'W') ||
			(stats[idStat].type == 'W' && this.type == 'A'))
			multiplier *= 2;

		if (stats[idStat].type == 'E' && this.match_element == '1')
			multiplier /= 10;

		var base;
		var nega = 1;
		if (start > end) {
			// nega - pot returned is quartered for the outliers
			base = (30500 * diff + 2 * 7625 * outliers) * stat_data.pot;
		} else {
			// positive - pot used is doubled for the outliers
			base = (100000 * diff + 200000 * outliers) * stat_data.pot;
			nega = -1;
		}
		// console.log(start, end, min, max, diff, outliers);
		return Math.floor(base * multiplier / 100000) * nega * penalty;
	}

	this.calculatePenalty = function (arr) {
		// returns penalty in percent, avoiding floating point
		var penalty = 100;
		var prev = "";
		var count = 1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] != prev) {
				prev = arr[i];
				if (count > 1) penalty += 5 * count * count;
				count = 1;
			}
			else
				count++;
		}
		if (count > 1) penalty += 5 * count * count;
		return penalty;
	}

	this.doAll = function (arr) {
		var i = 0;
		for (i = 0; i < arr.length && this.done == false; i += 2) {
			this.addStat(arr[i], arr[i + 1]);
		}

		for (var j = 0; j < MAX_SLOT; j++) {
			$("#slot" + j).val(this.stat[j]);
			update_stat(j);
			$("#value" + j).val(this.val[j]);
		}

		if (i >= arr.length)
			return true;
		else
			return false;
	}
}

//--- FUNCTIONS ---//
function valToCounter(val, idStat){
	if(val == 0)	return 0;	//to handle 0 value
	if(idStat == 0)	return 0;	//to handle slot with no stat yet
	minus = 1;
	if(val<0){
		val *= -1;
		minus = -1;
	}

	if(val<=stats[idStat].cheap_limit)
		return ((val/stats[idStat].multiplier) * minus);
	else{
		result = stats[idStat].cheap_limit/stats[idStat].multiplier;
		val -= stats[idStat].cheap_limit;
		if(stats[idStat].multiplier2 != 0)
			result += val/stats[idStat].multiplier2;
		return (result * minus);
	}
}


function calculateMats(oldCtr, newCtr, idStat) {
	var baseMat = stats[idStat].mat_base;
	var total = 0;
	var max;
	//--- mats reduction 1% per 10 Lvls and another 1% per 50 Lvls
	var reduction = (Math.floor(SMITH_PROF/10) + Math.floor(SMITH_PROF/50))/100;
	if(reduction < 0)	reduction = 0;	//in case some baka uses negative value
	if(reduction > 1)	reduction = 1;	//in case some baka uses ridiculous level
	var modifier = 1 - reduction;

	if (oldCtr < newCtr)	//increasing
		for (var i = oldCtr; i < newCtr; i++) {
			max = Math.max(Math.abs(i), Math.abs(i + 1));
			total += Math.trunc(baseMat * max * max * modifier);
		}
	else if (oldCtr > newCtr)	//decreasing
		for (var i = oldCtr; i > newCtr; i--) {
			max = Math.max(Math.abs(i), Math.abs(i - 1));
			total += Math.trunc(baseMat * max * max * modifier);
		}

	return total;
}

function show_eq_option(idx) {
	var sel = $('#equipment');
	var arr = equipments[idx];

	sel.empty();
	for (var key in arr) {
		sel.append($('<option>', {
			value: arr[key].potential,
			text: arr[key].name
		}));
	}
}

function show_stat_option(sel, type) {
	sel.empty();
	sel.append($('<option>', {
		value: 0,
		text: "--- Choose Stat ---"
	}));

	var prev = '';
	for (var key in stats) {
		if (stats[key].type == 'E' && type == 'A')
			continue;
		if (LEVEL_CAP < 210 && stats[key].name.startsWith('Reduce Dmg ('))
			continue;
		if (prev != stats[key].category) {
			prev = stats[key].category;
			sel.append($('<option>', {
				value: -1,
				text: '-- ' + stats[key].category + ' --',
				disabled: 'disabled',
				style: 'color:blue'
			}));
		}

		sel.append($('<option>', {
			value: key,
			text: stats[key].name
		}));
	}
}

function preview(myFormula) {
	for (var i = 0; i < MAX_SLOT; i++)
		if ($("#value" + i).val() < 0)
			$("#value" + i).css("color", "red");
		else
			$("#value" + i).css("color", "black");

	var newStat = [];
	for (var i = 0; i < MAX_SLOT; i++)
		newStat.push(parseInt($("#slot" + i).val()));

	var newVal = [];
	var newCtr = [];
	for (var i = 0; i < MAX_SLOT; i++){
		newVal.push(parseInt($("#value" + i).val()));
		if(newStat[i] != 0)
			newCtr.push(valToCounter(newVal[i], newStat[i]));
		else
			newCtr.push(0);
	}

	myFormula.tryStat(newStat, newVal, newCtr);
}

function confirm(myFormula) {
	let isZero = false;

	for (let i = 0; i < MAX_SLOT; i++)
		if($("#slot" + i).val() != 0 && -1 && $("#value" + i).val() == 0) isZero = true;

	if (isZero) {
		$("#save_gagal").html('Zero value on stat!');
		showSnackbar('save_gagal');
		return;
	}
	var newStat = [];
	for (var i = 0; i < MAX_SLOT; i++)
		newStat.push(parseInt($("#slot" + i).val()));

	var newVal = [];
	var newCtr = [];
	for (var i = 0; i < MAX_SLOT; i++){
		newVal.push(parseInt($("#value" + i).val()));
		if(newStat[i] != 0)
			newCtr.push(valToCounter(newVal[i], newStat[i]));
		else
			newCtr.push(0);
	}

	myFormula.addStat(newStat, newVal);
}

function repeatLast(myFormula) {
	if (myFormula.nsteps == 0) return;
	var newStat = [];
	for (var i = 0; i < MAX_SLOT; i++)
		newStat.push(parseInt($("#slot" + i).val()));

	var newVal = [];
	for (var i = 0; i < MAX_SLOT; i++){
		if (!lastDelta[i]) {
			newVal.push(myFormula.val[i]);
			continue;
		}
		var stat_data = stats[newStat[i]];
		var max_ctr = getMinMaxSteps(newStat[i], (lastDelta[i] > 0 ? 1 : -1));
		var step_limit = stat_data.cheap_limit / stat_data.multiplier;

		if (Math.abs(myFormula.ctr[i] + lastDelta[i]) > Math.abs(max_ctr))
			return;
		if(lastDelta[i] > 0){
			if((myFormula.ctr[i] + lastDelta[i]) <= step_limit)
				newVal.push(myFormula.val[i] + lastDelta[i]*stats[newStat[i]].multiplier);
			else{
				newVal.push(myFormula.val[i] + (step_limit-myFormula.ctr[i])*stats[newStat[i]].multiplier);
				newVal[i] += (myFormula.ctr[i]+lastDelta[i]-step_limit)*stats[newStat[i]].multiplier2;
			}
		}
		else if (lastDelta[i] < 0){
			if((myFormula.ctr[i] + lastDelta[i]) >= -1*step_limit)
				newVal.push(myFormula.val[i] + lastDelta[i]*stats[newStat[i]].multiplier);
			else{
				newVal.push(myFormula.val[i] + ((-1*step_limit)-myFormula.ctr[i])*stats[newStat[i]].multiplier);
				newVal[i] += (myFormula.ctr[i]+lastDelta[i]+step_limit)*stats[newStat[i]].multiplier2;
			}
		}
		else
			// should never reach this.
			newVal.push(myFormula.val[i]);


	}

	for (var i = 0; i < MAX_SLOT; i++)
		$("#value" + i).val(newVal[i]);

	myFormula.addStat(newStat, newVal);
}

function update_stat(i) {
	var iStat = $("#slot" + i).val();
	$("#value" + i).val(0);

	if (iStat ==0){
		$("#value" + i).val(0);
		$("#mat" + i).html("");
		$("#info" + i).html("");
	}
}

function update_type(type) {
	if (type == '8') {
		$('#matching_element').attr("disabled", "disabled");
		$('#matching_element').val(0);
	}
	else
		$('#matching_element').prop("disabled", null);

	show_eq_option(type);
}

function update_pot(pot) {
	$('#original').val(pot);
	$('#potential').val(pot);
}

function undo() {
	if (myFormula.nsteps == 0) return;

	reset_interface();

	var me = myFormula.match_element;
	var op = myFormula.original;
	var sp = myFormula.starting_pot;
	var type = myFormula.type;
	var steps = myFormula.steps;
	steps.pop();
	steps.pop();
	lastRepeat = 0;
	lastDelta = Array();

	myFormula = new Formula(type, sp, op, me);
	myFormula.doAll(steps);
	$("#simulator").fadeIn();
}

function optimize() {
	if (myFormula.rate <= 0) return;

	var steps = myFormula.steps;
	var me = myFormula.match_element;
	var op = myFormula.original;
	var type = myFormula.type;
	var sp;
	var rate;

	//loop to find minimum potential with same success rate
	do {
		sp = myFormula.starting_pot;
		rate = myFormula.rate;

		lastRepeat = 0;
		lastDelta = Array();
		myFormula = new Formula(type, sp - 1, op, me);
		res = myFormula.doAll(steps);
	} while (myFormula.rate == rate && res == true);

	//show minimum potential
	reset_interface();
	lastRepeat = 0;
	lastDelta = Array();
	myFormula = new Formula(type, sp, op, me);
	myFormula.doAll(steps);
	$("#simulator").fadeIn();
}

function start() {
	SMITH_PROF = $("#smithprof").val() * 1;
	LEVEL_CAP = $("#baselevel").val() *1;
	reset_interface();

	if(LEVEL_CAP<10){	//cannot start statting when level less than 1
		$("#save_gagal").html("WARNING: Base Level less than 10,<br>cannot add any stat!!");
		showSnackbar('save_gagal');
		return;
	}

	var type = ($("#type").val() == '8') ? 'A' : 'W';
	lastDelta = Array();
	lastRepeat = 0;
	myFormula = new Formula(type, parseInt($("#potential").val()), parseInt($("#original").val()), $("#matching_element").val());
	$("#simulator").fadeIn();
	$("#shortcut").fadeIn();
}

function reset_interface() {
	for (var i = 0; i < MAX_SLOT; i++) {
		var type = ($("#type").val() == '8') ? 'A' : 'W';
		show_stat_option($('#slot' + i), type);
		$('#slot' + i).fadeIn(0);
		$('#slot' + i).prop("disabled", null);
		$('#tdSlot' + i).html("");
		$('#tdSlot' + i).fadeOut(0);
		$("#value" + i).attr("disabled", "disabled");
		$("#value" + i).val(0);
		$("#value" + i).css("color", "black");
		$("#mat" + i).html("");
		$("#info" + i).html("");
		$("#btn-confirm").prop("disabled", null);
		$("#btn-confirm").html("Confirm");
		$("#btn-repeatlast").prop("disabled", null);
		$("#success").html("100%");
		$("#table-steps").html("");
		$("#totalMat" + (i + 1)).html("0 pts");
	}
	$("#highest").html("<b>0 pts</b>");
	lastDelta = Array();
	lastRepeat = 0;
}

function reload(){
	SMITH_PROF = $("#smithprof2").val() *1;
	reset_interface();
	myFormula = new Formula(load_type, load_pot, load_ori, load_me);
	myFormula.doAll(load_steps);
}

function saveshare() {
	if (myFormula.nsteps == 0) {
		$("#save_gagal").html("Empty formula!");
		showSnackbar('save_gagal');
		return;
	}

	optimize();
	if(myFormula.use_ori == 1)
		myFormula.original = 0;

	var mydata = {
		'formula': JSON.stringify(myFormula),
		'desc': $("#save-desc").val(),
		'smithLv':LEVEL_CAP
	};

	$.ajax({
		type: "POST",
		url: "ajax/saveformula.php",
		data: mydata,
		dataType: "html", // Set the data type so jQuery can parse it for you
		success: function (data) {
			console.log(data);
			let obj = JSON.parse(data);
			if (obj.err) {
				$("#save_gagal").html(obj.msg);
				showSnackbar('save_gagal');
			} else {
				$("#save_sukses").html(obj.msg);
				showSnackbar('save_sukses');
			}
			// $("#save-result").html(data);
		},error: function (request, status, error) {
			$("#save_gagal").html(`Error! Status code: ${status} - ${error}`);
			showSnackbar('save_gagal');
		}
	});

}

function like(formulaid) {
	var mydata = {
		'formulaid': formulaid
	};

	$.ajax({
		type: "POST",
		url: "ajax/likeformula.php",
		data: mydata,
		dataType: "html", // Set the data type so jQuery can parse it for you
		success: function (data) {
			$("#button-like").hide();
			$("#button-unlike").show();
			$("#save_sukses").html('Successfully like the formula!');
			showSnackbar('save_sukses');
		},error: function (request, status, error) {
			$("#save_gagal").html(`Error! Status code: ${status} - ${error}`);
			showSnackbar('save_gagal');
		}
	});
}

function unlike(formulaid) {
	var mydata = {
		'formulaid': formulaid
	};

	$.ajax({
		type: "POST",
		url: "ajax/unlikeformula.php",
		data: mydata,
		dataType: "html", // Set the data type so jQuery can parse it for you
		success: function (data) {
			$("#button-like").show();
			$("#button-unlike").hide();
			$("#save_sukses").html('Successfully removed the formula from your <i>Liked List</i>!');
			showSnackbar('save_sukses');
		},error: function (request, status, error) {
			$("#save_gagal").html(`Error! Status code: ${status} - ${error}`);
			showSnackbar('save_gagal');
		}
	});
}

function maximumStatVal(idx) {
	while(plusOneStatVal(idx)==true);
}

function minimumStatVal(idx) {
	while(minusOneStatVal(idx)==true);
}

// stat_id: number; minMax: -1 | 1;
function getMinMaxSteps(stat_id, minMax) {
	const max_only = ['MaxMP', 'Critical Rate', 'Critical Rate %', 'Aggro %', 'Guard Power %', 'Guard Recharge %', 'Evasion Recharge %'];
	const half_growth = ['Natural MP Regen', 'ATK %', 'MaxMP', 'MATK %', 'Aggro %'];
	const third_growth = [
		'MaxHP %', 'DEF %', 'MDEF %',
		'Physical Resistance %', 'Magic Resistance %',
		'Critical Damage',
		'% stronger against Fire', '% stronger against Wind', '% stronger against Water', '% stronger against Earth', '% stronger against Light', '% stronger against Dark', 
	];
	const half_third = [
		'Accuracy', 'Dodge',
		'Fire resistance %', 'Earth resistance %', 'Water resistance %', 'Wind resistance %', 'Light resistance %', 'Dark resistance %'
	];
	const twenty_five = [
		'Physical Pierce %', 'Magic Pierce %'
	];
	const sixty_growth = [
		'Stability %', 'Accuracy %', 'Dodge %', 'ASPD %', 'CSPD %', 'Critical Damage %',
		'Ailment Resistance %', 'Guard Power %', 'Guard Recharge %', 'Evasion Recharge %'
	];

	var level_max = Math.floor(LEVEL_CAP / 10);
	if (level_max < 0) level_max = 1; // for sub Lv10 statting

	var bonus = level_max - 20;
	// console.log('level', level_max, 'bonus', bonus);
	if (bonus < 0) bonus = 0;

	var stat_data = stats[stat_id];
	let base_max = stat_data.cheap_limit / stat_data.multiplier;

	// these stats do not grow beyond their Lv200 cap limit
	if (!stat_data.multiplier2) bonus = 0;

	// these stats grow at half the speed past the Lv200 cap
	if (half_growth.includes(stat_data.name)) bonus = Math.floor(bonus / 2);

	// these stats grow once every 30 levels
	if (third_growth.includes(stat_data.name)) bonus = Math.floor(bonus / 3);

	// these stats grow once every 60 levels
	if (sixty_growth.includes(stat_data.name)) bonus = Math.floor(bonus / 6);

	// these stats grow once every "15 levels" but gets "rounded up" to the nearest 10 (aka 20>10>20>10>etc...) starting at 220
	if (half_third.includes(stat_data.name)) bonus = Math.floor(bonus * 2/3);
	// if (bonus < 0) bonus = 0; // make sure bonus doesnt go into subzero numbers (this is for the old one that used "deduct one")

	// these stats grow once every "25 levels" but gets "rounded up" to the nearest 10 (aka 30>20>30>20>etc...) starting at 230
	if (twenty_five.includes(stat_data.name)) bonus = Math.floor(bonus * 2/5);
	// if (bonus < 0) bonus = 0;

	// these stats only start scaling past Lv200
	if (stat_data.name.startsWith('Reduce Dmg (')) base_max = 0;

	// these stats do not scale past their cheap limit negatively.
	if (max_only.includes(stat_data.name) && minMax < 0) bonus = 0;	
	var total = base_max + bonus;
	if (level_max < total) total = level_max;
	// console.log('base', base_max, 'bonus', bonus, 'total', total);
	
	return minMax * total;
}

function plusOneStatVal(idx) {
	var iStat = $("#slot" + idx).val();
	var currentVal = parseInt($("#value" + idx).val());

	if (iStat != 0) {
		var max = getMinMaxSteps(iStat, 1);
		var curr_ctr = valToCounter(currentVal, iStat);
		var step_limit = stats[iStat].cheap_limit / stats[iStat].multiplier;
		if(curr_ctr + 1 > max)	return false;
		else {
			if (curr_ctr < step_limit && curr_ctr >= -1 * step_limit)
				$("#value" + idx).val(currentVal + stats[iStat].multiplier);
			else
				$("#value" + idx).val(currentVal + stats[iStat].multiplier2);
			preview(myFormula);
			return true;
		}

	}
}

function minusOneStatVal(idx) {
	var iStat = $("#slot" + idx).val();
	var currentVal = parseInt($("#value" + idx).val());

	if (iStat != 0) {
		var min = getMinMaxSteps(iStat, -1);
		var curr_ctr = valToCounter(currentVal, iStat);
		var step_limit = stats[iStat].cheap_limit / stats[iStat].multiplier;

		if (curr_ctr - 1 < min)	return false;
		else if (currentVal==0 && stats[iStat].negative_ok==0)	return false; // some stats cannot be negative
		else {
			if (curr_ctr <= step_limit && curr_ctr > -1 * step_limit)
				$("#value" + idx).val(currentVal - stats[iStat].multiplier);
			else
				$("#value" + idx).val(currentVal - stats[iStat].multiplier2);
			preview(myFormula);
			return true;
		}

	}
}
function showSnackbar(id) {
	let element = $(`#${id}`);
	element.addClass('show');
	setTimeout(function(){ element.removeClass('show');}, 4000);
}
