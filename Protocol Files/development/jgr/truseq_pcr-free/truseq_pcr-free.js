runset.clear();

var path = "C:/VWorks Workspace/Protocol Files/development/jgr/truseq_pcr-free/";
var form = "truseq_pcr-free.VWForm"

run("C:/VWorks Workspace/Protocol Files/facility/resources/clear_inventory.bat", true);

var runsetMode = false;	// Alt settings for library prep runset (true/false)
formColumns = parseInt(formColumns, 10);

var presets = {};
presets["End repair"] = {tipColumn:1,reagentColumn:1,sampleVolume:50,reagentVolume:50,incubationTime:1800,doOffDeckIncubation:true};
presets["A-tailing"] = {tipColumn:2,reagentColumn:2,sampleVolume:15,reagentVolume:15,incubationTime:1800,doOffDeckIncubation:true};
presets["Ligation"] = {tipColumn:3,reagentColumn:3,sampleVolume:30,reagentVolume:5,incubationTime:600,doOffDeckIncubation:true};
presets["Stop ligation"] = {tipColumn:4,reagentColumn:4,sampleVolume:35,reagentVolume:5,incubationTime:0,doOffDeckIncubation:false};

presets["Fragmentation cleanup"] = {sampleVolume:50,beadVolume:80,elutionVolume:50};
presets["Size selection"] = {sampleVolume:100,beadVolume1:95,beadVolume2:30,bindVolume:160,transferVolume:150,elutionVolume:15};
presets["Ligation cleanup 1"] = {sampleVolume:37.5,beadVolume:42.5,elutionVolume:50};
presets["Ligation cleanup 2"] = {sampleVolume:50,beadVolume:50,elutionVolume:20};

var settings = {};

var fileNames = {};
fileNames["End repair"] = "truseq_pcr-free_reaction.pro";
fileNames["A-tailing"] = "truseq_pcr-free_reaction.pro";
fileNames["Ligation"] = "truseq_pcr-free_ligation.pro";
fileNames["Fragmentation cleanup"] = "illumina_spri.pro";
fileNames["Size selection"] = "illumina_double-spri.pro";
fileNames["Ligation cleanup 1"] = "illumina_spri.pro";
fileNames["Ligation cleanup 2"] = "illumina_spri.pro";
fileNames["Library prep"] = "truseq_pcr-free.rst";
fileNames["Ligation cleanup"] = "truseq_pcr-free_cleanup.rst";

var runsetOrder = [];

if(formProtocol === "Library prep") {
	runsetMode = true;
	runsetOrder = ["Fragmentation cleanup","End repair","Size selection",
			"A-tailing","Ligation","Ligation cleanup 1",
			"Ligation cleanup 2"];
	runset.openRunsetFile(path+fileNames[formProtocol], form);
	updateSettings("End repair");
} else if(formProtocol === "Ligation cleanup") {
	runsetMode = true;
	runsetOrder = ["Ligation cleanup 1","Ligation cleanup 2"];
	runset.openRunsetFile(path+fileNames[formProtocol], form);
} else {
	runsetMode = false;
	runset.appendProtocolFileToRunset(path+fileNames[formProtocol], 1, "", form);
	updateSettings(formProtocol);
}

function updateSettings(protocol) {
	if(protocol in presets) {
		for(var s in presets[protocol]) {
			settings[s] = presets[protocol][s];
		}
	} else {
		throw "EXCEPTION__UndefinedSetting:"+protocol;
	}
	print(protocol + " preset loaded");
}

var runsetIndex = 0;
function updateRunset() {
	updateSettings(runsetOrder[runsetIndex++]);
}