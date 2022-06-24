# BFU Advanced Scholarship

Повышенная государственная академическая стипендия

## Запуск сервера разработки

```shell
npm start
```

Сайт откроется по адресу [http://localhost:3000](http://localhost:3000) и будет автоматически обновляться при любом изменении кода

## Сборка сайта на production

```shell
npm run build
```

Система автоматически скомпилирует файлы в папке _build_.

Для того чтобы корректно перенести файлы в django приложение, нужно:
* заменить папки _css_ и _js_ в директории _scholarshipfront/static_ на папки _css_ и _js_ в директории _build/static_
![img.png](img.png)
* заменить файл в _scholarshipfront/templates/index.html_ на _build/index.html_
![img_1.png](img_1.png)
* Открыть файл _scholarshipfront/templates/index.html_ в Pycharm
![img_2.png](img_2.png)
* Отформатировать файл, нажав `Ctrl+Alt+L`
![img_3.png](img_3.png)
* Удалить префиксы `/bfu-advanced-scholarship` у тегов _link_ и _script_
![img_4.png](img_4.png)
* Добавить префикс `/static` для атрибута _href_ у первого тега _link_
![img_5.png](img_5.png)
* Проверить чтобы у тегов _link_ и _script_ атрибуты _src_ или _href_ начинались с `/`\
![img_6.png](img_6.png)
* ОЧЕНЬ ВАЖНО, поставить jinja тега `{% csrf_token %}`
![img_7.png](img_7.png)

Можно заливать в production