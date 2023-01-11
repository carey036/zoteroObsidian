import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Vault } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		// mine
		function parse2Dom(str:string){
			var div = document.createElement("div");
			div.innerHTML = str;
			return div;
		}
		this.addCommand({
			id: 'add ref',
			name: 'Add Ref',
			editorCallback:   (editor: Editor, view: MarkdownView) => {
				const content = parse2Dom(editor.getValue());
				const citations:any = Array.from(content.getElementsByTagName("citation"))
				console.log(citations)
				var ref = ""
				const references = new Set()
				citations.forEach((citation:any, i:any) => {
					const reference = `${citation.attributes.author.value} ${citation.attributes.year.value} ${citation.attributes.title.value}`
					if(!references.has(reference)){
						references.add(reference)
						ref += `[${i+1}] ${citation.attributes.author.value} (${citation.attributes.year.value}) ${citation.attributes.title.value}\n\n`
					}
				});
				console.log(ref)
				editor.replaceSelection(ref);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Add reference'});
		containerEl.createEl('div', {text: 'this plugins should be used with Citation, you need to set "Markdown primary citation template" of Citation to "<citation author="{{#each entry.author}}{{#if @first}}{{this.family}}{{this.given}}{{/if}}{{/each}}" year="{{year}}" title="{{title}}"><a href={{zoteroSelectURI}}>{{#each entry.author}}{{#if @first}}{{this.family}}{{this.given}}{{/if}}{{/each}}({{year}})</a></citation>'});
		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
