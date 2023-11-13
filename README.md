# Property Transformer Plugin for Obsidian

The Property Transformer Plugin is an essential tool for Obsidian users looking to streamline their note-taking process. This plugin specializes in converting markdown text properties into YAML properties, which enhances the functionality and organization of Obsidian notes.

## Features

- **Automatic Conversion**: Transforms markdown text properties at the top of the page into YAML properties.
- **Customizable Settings**: Allows users to configure plugin settings to match their note-taking preferences.
- **Folder-Specific Functionality**: Processes files within specified folders, tailoring the conversion process to user needs.
- **Diverse Property Types**: Handles various property types including items, dates, tags, and lists.

## Installation

1. Download the Property Transformer Plugin from the Obsidian community plugin repository.
2. In Obsidian, navigate to `Settings > Community Plugins`.
3. Choose `Browse` and find the Property Transformer Plugin.
4. Install and enable the plugin.

## Usage

After installation, the plugin works in the background to transform markdown properties into YAML properties. It processes files in designated folders, applying the transformation rules as defined in the plugin settings.

### Example

Consider a note with the following markdown properties:

```
- **Tipo**: [[Research Note]]
- **Fecha de creación**: Monday, January 1, 2023, @ 12:00 PM
- **Etiquetas**: #science, #research
- **Temas centrales**: Space, Technology
```

The plugin will convert these into YAML properties like:

```yaml
---
Tipo: "Research Note"
Fecha de creación: 2023-01-01T12:00:00
Etiquetas:
  - science
  - research
Temas centrales:
  - "Space"
  - "Technology"
---
```

## Configuration

Users can configure the plugin settings to suit their specific requirements. The `PropertyTransformerPluginSettings` interface and `DEFAULT_SETTINGS` allow for setting defaults and customizations.

## Support and Contribution

For support, feature requests, or contributions, visit the Property Transformer Plugin's GitHub repository.
