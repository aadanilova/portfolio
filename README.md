# portfolio

Сайт-портфолио Анны Даниловой, графического дизайнера и AI-креатора: мерч, упаковка, промопродукция и AI-визуал.

Статический одностраничный сайт (HTML, CSS, vanilla JS) для публикации на GitHub Pages. Сборка не нужна.

## Структура

```
index.html          разметка и тексты
styles.css          стили (светлая + автоматическая тёмная тема)
script.js           появление секций, счётчики, tilt карточек, модалка
assets/favicon.svg
assets/og.jpg       превью для соцсетей 1200×630
assets/ai/          логотипы AI-инструментов (lobehub/icons, MIT)
assets/clients/     логотипы компаний
assets/works/       изображения работ
```

## Публикация на GitHub Pages

1. Settings → Pages.
2. Source: **Deploy from a branch**, Branch: **main**, папка **/ (root)** → Save.
3. Через 1–2 минуты сайт будет по адресу https://aadanilova.github.io/portfolio/

## Темы

Светлая и тёмная темы. По умолчанию сайт следует системной настройке, кнопка в шапке переключает тему вручную (выбор запоминается в localStorage).

## Типографика

В текстах после коротких предлогов и союзов стоят неразрывные пробелы (`&nbsp;`), чтобы они не висели в конце строки. При правке текстов сохраняйте это правило.

## Изображения работ

Обложка проекта: `assets/works/<slug>.jpg`, 1600×1200, JPG до 300 КБ.
Большое фото в модалке: `assets/works/<slug>-01.jpg`, длинная сторона до 1600 px.
Пока файла нет, карточка показывает CSS-плейсхолдер.

| slug | статус |
|---|---|
| gpb-constructor | есть |
| gpb-backpacks | есть |
| cz-constructors, cz-ornaments, cz-postcards | есть |
| moscow-cats | есть |
| f6-candles, f6-bookends | есть |
| uniel-tea | есть |
| ai-fashion-a, ai-fashion-b | есть |

После добавления `-01.jpg` пропишите `<img>` в `<template class="case-details">` нужной карточки в `index.html`.
