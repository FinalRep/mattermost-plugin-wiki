[![Tests](https://github.com/finalrep/mattermost-plugin-wiki/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/finalrep/mattermost-plugin-wiki/actions/workflows/test.yml)
[![Go Report Card](https://goreportcard.com/badge/github.com/CyberPeace-Institute/mattermost-plugin-wiki)](https://goreportcard.com/report/github.com/CyberPeace-Institute/mattermost-plugin-wiki)
[![License](https://img.shields.io/badge/license-Apache_2.0-blue.svg)](https://github.com/FinalRep/mattermost-plugin-wiki/blob/main/LICENSE)

# Mattermost Wiki Plugin

![wiki](https://github.com/FinalRep/mattermost-plugin-wiki/blob/main/assets/wiki-logo-512.png?raw=true)

### A self-hosted plugin for managing a simple wiki within your Mattermost installation

This plugin creates a simple wiki for your Mattermost.

## Features

- Markdown formatted documentations
- Create multiple pages separated by teams and channels
- Markdown Editor integration
- Stored inside Mattermost's own database

## Try Mattermost Wiki Plugin

Access the latest releases of the Mattermost wiki plugin by downloading the `mattermost-plugin-wiki.tar.gz` file from the releases in this repository: <https://github.com/finalrep/mattermost-plugin-wiki/releases>. After downloading and installing the plugin in the System Console, select the menu on the right of your chat to open your team **Wiki**.

## Development

### Getting Started

Clone the repository:
```
git clone https://github.com/finalrep/mattermost-plugin-wiki 
```

### Build your plugin:
```
make
```

This will produce a single plugin file (with support for multiple architectures) for upload to your Mattermost server:

```
dist/com.mattermost.plugin-wiki-1.0.0.tar.gz
```

# Sources

This plugin is based on the original code from the [CyberPeace-Institute](https://github.com/CyberPeace-Institute/mattermost-plugin-wiki).
