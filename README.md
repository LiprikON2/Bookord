# Bookord

[![wakatime](https://wakatime.com/badge/github/LiprikON2/Bookord.svg)](https://wakatime.com/badge/github/LiprikON2/Bookord)



![](assets/icons/brand/bookord-logo.svg)

![](https://i.imgur.com/I25O50n.png)

![](https://i.imgur.com/k8MDUEz.png)


<div style="width:300px;vertical-align:top;font-family: Arial;font-size:9pt;line-height: normal">
<a rel="license" href="//responsivevoice.org/"><img title="ResponsiveVoice Text To Speech" src="https://responsivevoice.org/wp-content/uploads/2014/08/120x31.png" style="float:left;padding-right:2px" /></a><span xmlns:dct="https://purl.org/dc/terms/" property="dct:title"><a href="//responsivevoice.org/" target="_blank" title="ResponsiveVoice Text To Speech">ResponsiveVoice</a></span> used under <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" title="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License">Non-Commercial License</a></div>
<div style="clear:both;">&nbsp;</div>



## [RU] 

### Установка

1. Скачать и запустить [установщик для Windows](https://github.com/LiprikON2/bookord/releases/latest)

- Поддерживаются книги формата `.epub`
- Приложение хранит свои настройки по пути `%APPDATA%/Roaming/bookord`
- Книги добавленные в приложение копируются по пути `%APPDATA%/Roaming/bookord/Books`


___ 

## [EN]
> Based on [Electron React Webpack Typescript](https://github.com/codesbiome/electron-react-webpack-typescript-2024) template by @codesbiome


### Download
> Books are stored at `%APPDATA%/bookord/Books` (Windows)

[Download link](https://github.com/LiprikON2/bookord/releases/latest)


___



### Development


Install dependencies using [npm](https://www.npmjs.com/):

```bash
npm install
```

<br />

## Start : Development

To develop and run your application, you need to run following command.
<br />
Start electron application for development :

```bash
npm run dev
```

<br />



## Package : Production

Customize and package your Electron app with OS-specific bundles (.app, .exe etc)

```bash
npm run package
```

<br />

## Make : Production

Making is a way of taking your packaged application and making platform specific distributables like DMG, EXE, or Flatpak files (amongst others).

```bash
npm run make
```

<br />

## Publish : Production

Publishing is a way of taking the artifacts generated by the `make` command and sending them to a service somewhere for you to distribute or use as updates. (This could be your update server or an S3 bucket)

```bash
npm run publish
```

<br />

