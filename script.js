$(document).ready(function () {
    if($(window).width() > 768) {
    const $mapContainer = $('.map-container');
    const $pointContainer = $('.point-container');
    let selectedPoint = null;
    
    let mapWidth = $mapContainer.width();
    let mapHeight = $mapContainer.height();

    const points = []; // Массив для хранения информации о точках

    // Функция для создания новой точки
    
    function createPoint(id, x, y) {
        
        const $point = $('<div class="point"></div>');
        $point.attr('data-id', id);
        $point.css({
            left: x + 'px',
            top: y + 'px',
            'z-index': 1
        });

        $point.draggable({
            // containment: [0, 0, mapWidth - $point.width(), mapHeight ],
            stop: function (event, ui) {
                updatePointPosition(ui.position.left, ui.position.top, $point);
            }
        });

        const $pointInfoBlock = $('<div class="pointInfoBlock"><button class="delete-button">Удалить</button><img class="pointInfoBlock__img" src="example.jpg"><div class="pointInfoBlock__title">Заголовок</div><div class="pointInfoBlock__desc">Описание</div><a href="" class="pointInfoBlock__link">Узнать подробнее</a></div>');

        $point.append($pointInfoBlock);

        $point.on('click', function () {
            // Переключение класса selected при клике на точку
            $(this).toggleClass('selected');
        });

        $pointContainer.append($point);

        // Добавляем информацию о точке в массив
        points.push({
            $element: $point,
            x: x,
            y: y
        });
    }
    

    // Функция для удаления точки
    function removePoint($point) {
        // Удаляем информацию о точке из массива
        const index = points.findIndex((point) => point.$element.is($point));
        if (index !== -1) {
            points.splice(index, 1);
        }

        $point.remove();
    }

    // Функция для обновления позиции точки
    function updatePointPosition(x, y, $point) {
        // Обновляем информацию о позиции точки
        const index = points.findIndex((point) => point.$element.is($point));
        if (index !== -1) {
            points[index].x = x;
            points[index].y = y;
        }

        const xPercent = (x / mapWidth) * 100;
        const yPercent = (y / mapHeight) * 100;
        console.log(`Точка перемещена в (${xPercent}%, ${yPercent}%) относительно размеров карты.`);
        // Здесь вы можете выполнить дополнительную логику или отправить данные на сервер.
    }

    // Обработчик изменения размеров окна браузера
    $(window).on('resize', function () {
        const newMapWidth = $mapContainer.width();
        const newMapHeight = $mapContainer.height();

        // Обновляем позиции всех точек относительно новых размеров контейнера
        points.forEach((point) => {
            const oldPosition = point.$element.position();
            const newX = (oldPosition.left / mapWidth) * newMapWidth;
            const newY = (oldPosition.top / mapHeight) * newMapHeight;

            point.$element.css({
                left: newX + 'px',
                top: newY + 'px'
            });

            // Обновляем информацию о позиции точки
            point.x = newX;
            point.y = newY;
        });

        mapWidth = newMapWidth;
        mapHeight = newMapHeight;
    });

    // Обработчик клика по карте для создания новой точки
    $mapContainer.on('click', function (event) {
        if($(window).width() > 768) {
        if($(event.target).hasClass("point") || $(event.target).hasClass("pointInfoBlock") || $(event.target).hasClass("delete-button") || $(event.target).hasClass("pointInfoBlock__link") || $(event.target).hasClass("pointInfoBlock__title") || $(event.target).hasClass("pointInfoBlock__desc") || $(event.target).hasClass("pointInfoBlock__img")) {
            return;
        } else {
        const offsetX = event.pageX - $mapContainer.offset().left;
        const offsetY = event.pageY - $mapContainer.offset().top;
        const id = prompt('Введите область точки:');
            if (id) {
                createPoint(id, offsetX, offsetY);
            }
        }
        }
    });

    // Обработчик клика на кнопку удаления
    $(document).on("click", ".delete-button", function (e) {
        e.stopPropagation();
        removePoint($(this).parent().parent());
    });

    
        const $select = $('#regions');

        $select.on('change', function () {
            const selectedValue = $(this).val();
            const selectedOption = $(this).find('option:selected');
            const selectedIndex = $(this).find('option').index(selectedOption);
            $(".point-container svg").addClass("hide");
            $(".point-container svg").eq(selectedIndex + 1).removeClass("hide");
            $(".region__name").text(selectedValue);
            $(".region__group").show();
            $('.point').not('[data-id="' + selectedIndex + '"]').hide();
            if(selectedIndex != 0) {
                function mobileCalculate() {
                    
                }
                mobileCalculate();
            }
        });
        $('#region__close').on('click', function () {
            $select.val('');
            $(".point-container svg").addClass("hide");
            $(".point-container svg").eq(0).removeClass("hide");
            $(".region__group").hide();
            $('.point').show();
            $('.point__mobile').hide();
        });
                // Вінницька область - 0
                // Волинська область - 1
                // Дніпропетровська область - 2
                // Донецька область - 3
                // Запорізька область - 4
                // Київська область - 5
                // Кіровоградська область - 6
                // Луганська область - 7
                // Львівська область - 8
                // Миколаївська область - 9
                // Одеська область - 10
                // Полтавська область - 11
                // Сумська область - 12
                // Харківська область - 13
                // Херсонська область - 14
                // Хмельницька область - 15
                // Черкаська область - 16
                // Чернігівська область - 17
                // Чернівецька область - 18
                // Житомирська область - 19
                // Закарпатська область - 20
                // Івано-Франківська область - 21
                // Рівненська область - 22
                // Тернопільська область - 23
                // АР Крим - 24

                let hideTimer;

                $(document).on('mouseenter', '.point', function () {
                    const $point = $(this);
                    const $pointInfoBlock = $point.find('.pointInfoBlock');
                    const pointPosition = $point.offset();
                    const pointWidth = $point.outerWidth();
                    const windowWidth = $(window).width();
                    const pointInfoBlockWidth = $pointInfoBlock.outerWidth();

                    // Расстояние от точки до левого и правого края экрана
                    const distanceToLeftEdge = pointPosition.left;
                    const distanceToRightEdge = windowWidth - (pointPosition.left + pointWidth);

                    // Минимальное расстояние до границы экрана для pointInfoBlock
                    const minDistanceToEdge = 300;

                    if (distanceToLeftEdge < minDistanceToEdge) {
                        // Если ближе к левому краю, разместите pointInfoBlock справа от точки
                        $pointInfoBlock.css({
                            left: pointWidth + 10 + 'px',
                            right: 'auto'
                        });
                    } else if (distanceToRightEdge < minDistanceToEdge) {
                        // Если ближе к правому краю, разместите pointInfoBlock слева от точки
                        $pointInfoBlock.css({
                            right: pointWidth + 10 + 'px',
                            left: 'auto'
                        });
                    } else {
                        // Если точка находится посередине, разместите pointInfoBlock справа от точки
                        $pointInfoBlock.css({
                            left: pointWidth + 10 + 'px',
                            right: 'auto'
                        });
                    }

                    // Отображаем pointInfoBlock
                    $pointInfoBlock.css({
                        display: 'flex' // Используем display: flex
                    });

                    // Очищаем предыдущий таймер, если есть
                    clearTimeout(hideTimer);
                });

                // Обработчик для скрытия pointInfoBlock при уходе курсора
                $(document).on('mouseleave', '.point', function () {
                    const $pointInfoBlock = $(this).find('.pointInfoBlock');
                    
                    // Устанавливаем задержку перед скрытием pointInfoBlock
                    hideTimer = setTimeout(function () {
                        $pointInfoBlock.css({
                            display: 'none' // Используем display: none для скрытия
                        });
                    }, 100); // Измените значение задержки по вашему усмотрению (в миллисекундах)
                });           
    }
});
