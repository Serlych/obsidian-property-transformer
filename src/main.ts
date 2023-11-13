import { App, Modal, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';


export default class PropertyTransformerPlugin extends Plugin {
	settings: PropertyTransformerPluginSettings;
	months = {
	  January: '01', February: '02', March: '03', April: '04', May: '05', June: '06', July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
	};

	async onload() {
		await this.loadSettings();

		// Config
		const originalKeyPattern = '- \*\*{{key}}\*\*: '
		const map = {
			'Zettelkasten': {
				'Tipo': { key: 'Tipo', valuePattern: /\[\[([^[\]]*)\]\]/, type: 'item', order: 0 },
				'Fecha': { key: 'Fecha de creación', valuePattern: /(\w+), (\w+) (\d+)(?:\w+), (\d+) @ (\d+):(\d+) (\w+)/, type: 'date', order: 2 },
				'Etiquetas': [{
					key: 'Etiquetas',
					valuePattern: '',
					type: 'tags',
					order: 4
				}, {
					key: 'Temas centrales',
					valuePattern:'' ,
					type: 'list',
					order: 1
				}],
				'Fecha de modificación': { key: 'Fecha de modificación', valuePattern: null, type: 'date', order: 3 }
			}
		}

		let files: TFile[] = this.app.vault.getMarkdownFiles();

		for (const [containingFolder, newMap] of Object.entries(map)) {
			files = files.filter(f => f.path.includes(containingFolder));

			for (const obsidianFile of files) {
				const file = await this.app.vault.read(obsidianFile);
				const contents = file.split('\n');

				const headers = [];

				if (contents[0] === '---') {
					continue;
				}

				for (const [originalKey, newKeyProps] of Object.entries(newMap)) {
					const keyPattern = originalKeyPattern.replace('{{key}}', originalKey);
					const input = contents.find(c => c.includes(keyPattern));

					if (newKeyProps.valuePattern === null) {
						headers[newKeyProps.order] = `${newKeyProps.key}: `;
						continue;
					}

					if (newKeyProps.type === 'item') {
						const value = input.match(newKeyProps.valuePattern);
						headers[newKeyProps.order] = `${newKeyProps.key}: "${value[0]}"`;
					}

					if (newKeyProps.type === 'date') {
						const value = input.match(/(\w+), (\w+) (\d+)(?:\w+), (\d+) @ (\d+):(\d+) (\w+)/);
						const [_, __, month, day, year, hour, minute, ampm] = value;
						  
						let hour24 = parseInt(hour, 10);
						if (ampm.toLowerCase() === "pm" && hour24 < 12) {
							hour24 += 12;
						}
						  
						let date = `${year}-${this.months[month]}-${day.padStart(2, '0')}T${hour24.toString().padStart(2, '0')}:${minute}:00`;
						headers[newKeyProps.order] = `${newKeyProps.key}: ${date}`;
					}

					if (Array.isArray(newKeyProps)) {
						const value = input.replace(keyPattern, '').split(', ');

						for (const subkey of newKeyProps) {
							if (subkey.type === 'tags') {
								const tags = value.filter(it => it.charAt(0) === '#').map(it => it.substr(1));
								headers[subkey.order] = `${subkey.key}:\n  - ${tags.join('\n  - ')}`;
							}

							if (subkey.type === 'list') {
								const list = value.filter(it => it.charAt(0) !== '#');
								headers[subkey.order] = `${subkey.key}:\n  - "${list.join('"\n  - "')}"`;
							}
						}
					}
				}

				headers.unshift('---');
				headers.push('---');

				
				const restOfFile = contents.splice(4);
				const newContent = headers.concat(restOfFile).join('\n');
				// this.app.vault.modify(obsidianFile, newContent);
			}
		}
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// ======

interface PropertyTransformerPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PropertyTransformerPluginSettings = {
	mySetting: 'default'
}

class SampleSettingTab extends PluginSettingTab {
	plugin: PropertyTransformerPlugin;

	constructor(app: App, plugin: PropertyTransformerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
