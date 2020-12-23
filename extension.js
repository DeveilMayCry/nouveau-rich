// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { default: Axios } = require('axios');
const { setTextRange } = require('typescript');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nouveau-rich" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nouveau-rich.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from nouveau-rich!');
	});

	context.subscriptions.push(disposable);

	let configuration = vscode.workspace.getConfiguration().get("rich");
	let url = "https://api.binance.com/api/v3/ticker/price";
	let filter = configuration.symbols;
	let unit = "USDT";
	var statusBarItems = filter.map(a => {
		var myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		myStatusBarItem.color = "lightgreen";
		myStatusBarItem.symbol = a;
		myStatusBarItem.show();
		return myStatusBarItem
	})
	context.subscriptions.push(statusBarItems);

	setInterval(() => {
		Axios.get(url).then(response => {
			var symbols = response.data.filter(a => filter.indexOf(a.symbol.replace(unit, "")) !== -1);
			symbols.forEach(a => {
				var myStatusBarItem = statusBarItems.filter(b => b.symbol === a.symbol.replace(unit, ""))[0];
				myStatusBarItem.text = `${a.symbol} $${Math.floor(a.price * 100) / 100}`
			})
		}).catch(err => console.error(err));
	}, 5000);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}