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