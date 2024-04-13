# Bookord


![](https://i.imgur.com/I25O50n.png)

![](https://i.imgur.com/k8MDUEz.png)



## [RU] 

### Установка

1. Скачать и запустить [установщик для Windows](https://github.com/LiprikON2/bookord/releases/latest)

- Поддерживаются книги формата `.epub`
- Приложение хранит свои настройки по пути `%APPDATA%/Roaming/bookord`
- Книги добавленные в приложение копируются по пути `%APPDATA%/Roaming/bookord/Books`


___ 

## [EN]


Based on [Electron React Webpack Typescript](https://github.com/codesbiome/electron-react-webpack-typescript-2024) template by @codesbiome


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

