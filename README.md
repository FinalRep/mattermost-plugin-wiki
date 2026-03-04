# Mattermost Wiki Plugin

### A self-hosted plugin for managing a simple wiki within your Mattermost installation

This plugin creates a simple wiki for your Mattermost.
The docs will be in .md format and saved in the Mattermost database.

## Try Mattermost Wiki Plugin

Access the latest releases of the Mattermost wiki plugin by downloading the `mattermost-plugin-wiki.tar.gz` file from the releases in this repository: <https://github.com/finalrep/mattermost-plugin-wiki/releases>. After downloading and installing the plugin in the System Console, select the menu on the right of your chat to open your team **Wiki**.

## Getting Started
Clone the repository:
```
git clone https://github.com/finalrep/mattermost-plugin-wiki 
```

Note that this project uses [Go modules](https://github.com/golang/go/wiki/Modules). Be sure to locate the project outside of `$GOPATH`.

### Build your plugin:
```
make
```

This will produce a single plugin file (with support for multiple architectures) for upload to your Mattermost server:

```
dist/com.mattermost.plugin-wiki-1.0.0.tar.gz
```

Then no matter how you created the **com.mattermost.plugin-wiki-0.1.0.tar.gz** file you can upload it and [manually install](https://mattermost.gitbook.io/plugin-confluence/setup/install-the-mattermost-plugin#alternative-install-via-manual-upload) it.

# Sources

This plugin is based on the original code from the [CyberPeace-Institute](https://github.com/CyberPeace-Institute/mattermost-plugin-wiki).
