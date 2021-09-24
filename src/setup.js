const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const presence = require("./presence.js")
var isPresenceEnabled = false;
var firstTime = false;

function run(clear) {
	if (clear == undefined || clear == true) {
		console.clear();
		console.log(chalk.bold.cyan(`Configure SaladBind`))
	}
	if (fs.existsSync('./data/config.json')) {
		inquirer.prompt([{
			type: 'confirm',
			name: 'overwrite',
			message: chalk.yellow("An older config file was found! Are you sure you want to overwrite it?"),
			default: false
		}]).then(function(answers) {
			if (answers.overwrite) {
				continueSetup();
			} else {
				require("./index").menu();
			}
		});
	} else {
		firstTime = true;
		continueSetup(clear);
	}
}
async function continueSetup(clear) {
	if (clear == undefined || clear == true) {
		console.clear();
		console.log(chalk.bold.cyan(`Configure SaladBind`))
	}
	if(firstTime) {
		console.log(`${chalk.greenBright.bold("Welcome to SaladBind!")}
This is a program that makes it easier to select miner, algorithm and pool for Salad! 
All of the money you mine using SaladBind goes to Salad, and all Salad boosts and XP will work in SaladBind.
		`);
	}
	console.log(`Discord Rich Presence means that your Discord friends and people in Discord servers will see that you use SaladBind. 
They will see your SaladBind version, miner, algorithm, and pool on your Discord profile.
In order for this to work, you'll need to have the Discord desktop app installed.
	`);
	await inquirer.prompt([{
		type: 'confirm',
		name: 'presence',
		message: chalk.yellow("Enable Discord Rich Presence? (may require app restart)"),
		default: false
	}]).then(function(answers) {
		if (answers.presence) {
			isPresenceEnabled = true;
		} else {
			presence.disconnect();
		}
	});
	
	if(firstTime) {
		console.clear();
		console.log(chalk.greenBright.bold("Welcome to SaladBind!"));
	}
	console.log(`Now it's time to get your Rig ID.\nThis is needed in order for Salad to see which account to put the mined money in.\n`);

	const promptResult = await inquirer.prompt([{
		type: 'list',
		name: "useapi",
		message: "How would you like to provide your mining details?",
		choices: [{
				name: `Automatic ${chalk.yellow("(Read from Salad logs)")}`,
				value: "auto"
			},
			{
				name: `Automatic ${chalk.yellow("(Get with Salad Auth token)")}`,
				value: "api"
			}, {
				name: `Manual ${chalk.yellow("(Input worker ID manually)")}`,
				value: "manual"
			}
		]
	}]);
	if (promptResult.useapi == "auto") {
		function getIDFromLogs(filename) {
			let logPath;
			if (process.platform == "win32") {
				logPath = path.join(process.env.APPDATA, "Salad", "logs", filename);
			} else if (process.platform == "linux") {
				logPath = path.join(process.env.HOME, ".config", "Salad", "logs", filename);
			} else if (process.platform == "darwin") {
				logPath = path.join(process.env.HOME, "Library", "Logs", "Salad", filename); // untested, google says it works
			}
			let logFileContent;
			try {
				logFileContent = fs.readFileSync(logPath).toString();
			} catch (err) {
				console.log(chalk.bold.red(`A error occured while reading the log file ${filename}, make sure that you have ran Salad and that SaladBind has permission to access it.`))
				return;
			}
			const rigIDRegex = /^NiceHash rig ID: [a-z0-9]{15}$/m;
			let rigID = logFileContent.match(rigIDRegex);
			if (rigID) rigID = rigID.join(" ");
			if (rigID) rigID = rigID.split(": ")[1];
			return rigID;
		}
		let spinner = ora("Searching...").start();
		let rigID = getIDFromLogs("main.log") ?? getIDFromLogs("main.old.log")
		if (!rigID) {
			console.log(chalk.bold.red("Could not find your Rig ID! Please make sure that you have mined for at least 5 minutes using Salad's official application."));
			setTimeout(() => {
				continueSetup()
			}, 3500);
			return;
		}

		spinner.succeed();
		spinner = ora("Saving...").start();
		if (!fs.existsSync("./data")) {
			fs.mkdirSync("./data");
		}
		fs.writeFileSync("./data/config.json", JSON.stringify({ "minerId": rigID, "discordPresence": isPresenceEnabled }));
		spinner.succeed();
		console.log(chalk.bold.greenBright(`That's all there is to it!`))
		console.log(`You're done - you can now start using SaladBind!\nStarting in 5 seconds...`)
		setTimeout(() => {
			console.clear();
			require("./index").menu();
		}, 5000);
	} else if (promptResult.useapi == "api") {
		//auth
		console.log(chalk.green("We need the token to get your Wallet and Rig ID automatically.\nThey will not be stored!\n\nIf you do not know how to find your sAccess Token / Salad Authentication token please read this:\nhttps://bit.ly/saladbindconfig (copy this to read it)"))
		const auth = await inquirer.prompt([{
			type: 'input',
			name: 'auth',
			message: 'What is your Salad Access Token?',
			validate: function(input) {
				if (input.length == 778 || input == "cancel") {
					return true;
				}
				return `Your Salad Access Token is required for automatic mode. If you don't want this, type "${chalk.yellowBright("cancel")}" and select manual\nor select to get them automatically from the logs of Salad. ${chalk.yellow.bold("\nYou may be seeing this if you entered the token incorrectly, the token is 778 chars long!\nIf you do not know how to configure read this\nhttps://bit.ly/saladbindconfig (copy this to read it)")}`;
			}
		}]);
		if(auth.auth == "cancel") {
			return await continueSetup(true);
		}
		const spinner = ora("Getting miner details...").start();
		try {
			let minerDetails = await require("./getMachine").getInfo(auth.auth);
			if (!fs.existsSync("./data")) {
				fs.mkdirSync("./data");
			}
			fs.writeFileSync("./data/config.json", JSON.stringify({"id":minerDetails.id, "minerId": minerDetails.minerId, "discordPresence": isPresenceEnabled }));
			
			spinner.stop();
			console.clear();
			console.log(chalk.bold.greenBright(`That's all there is to it!`))
			console.log("You are now ready to use SaladBind.\nStarting in 5 seconds...")
			setTimeout(() => {
				require("./index").menu();
			}, 5000);
		} catch (e) {
			spinner.fail();
			console.log(e);
			console.log(chalk.bold.red("Failed to get your Rig ID! Please contact support on our Discord server (https://discord.gg/HfBAtQ2afz) and attach an image of the data above."));
		}
	} else {
		if(firstTime) {
			console.clear();
			console.log(chalk.greenBright.bold("Welcome to SaladBind!"));
		}
		console.log("You can enter NiceHash's Rig ID or Ethermine's Worker ID, both are the same.")
		const worker = await inquirer.prompt([{
			type: 'input',
			name: 'id',
			message: 'What is your Salad worker ID?',
			validate: function(input) {
				if (input.length == 15 || input == "cancel") {
					return true;
				}
				return `If you don't want to manually enter your Worker ID, type "${chalk.yellowBright("cancel")}" and select an automatic mode. ${chalk.yellow.bold("You may be seeing this if you entered the Worker ID incorrectly!")}`;
			}
		}]);
		if(worker.id == "cancel") {
			return await continueSetup(true);
		}
		const spinner = ora("Saving...").start();
		if (!fs.existsSync("./data")) {
			fs.mkdirSync("./data");
		}
		fs.writeFileSync("./data/config.json", JSON.stringify({ "minerId": worker.id, "discordPresence": isPresenceEnabled }));
		spinner.stop();
		console.clear();
		console.log(chalk.bold.greenBright(`That's all there is to it!`))
		console.log("You're done - you can now start using SaladBind!\nStarting in 5 seconds...")
		setTimeout(() => {
			presence.mainmenu()
			require("./index").menu();
		}, 5000);
	}
}




module.exports = {
	run
};
