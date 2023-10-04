$(document).ready(function () {
    if ($(window).width() < 769) {
        const pointPositions = {};
        const $select = $('#regions');
        const $mapContainer = $('.map-container');
        const $pointContainer = $('.point-container');
        const points = [];

        function updatePointPosition(xPercent, yPercent, $point) {
            // Обновляем информацию о позиции точки
            const index = points.findIndex((point) => point.$element.is($point));
            if (index !== -1) {
                points[index].xPercent = xPercent;
                points[index].yPercent = yPercent;
            }

            const mapWidth = $mapContainer.width();
            const mapHeight = $mapContainer.height();
            const xPixels = (xPercent / 100) * mapWidth;
            const yPixels = (yPercent / 100) * mapHeight;

            console.log(`Точка перемещена в (${xPercent}%, ${yPercent}%) относительно размеров карты.`);

            // Здесь вы можете выполнить дополнительную логику или отправить данные на сервер.
            localStorage.setItem(`point${current_index}`, `(${xPercent}%, ${yPercent}%)`);
        }

        function createPoint(id, xPercent, yPercent) {
            const $point = $('<div class="point__mobile"></div>');
            $point.attr('data-id', id);

            // Применяем относительные координаты
            $point.css({
                left: xPercent + '%',
                top: yPercent + '%',
                'z-index': 1
            });

            $point.draggable({
                stop: function (event, ui) {
                    const xPixels = ui.position.left;
                    const yPixels = ui.position.top;

                    // Преобразуем пиксели в относительные координаты
                    const mapWidth = $mapContainer.width();
                    const mapHeight = $mapContainer.height();
                    const xPercent = (xPixels / mapWidth) * 100;
                    const yPercent = (yPixels / mapHeight) * 100;

                    updatePointPosition(xPercent, yPercent, $point);
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
                xPercent,
                yPercent
            });
        }

        function removePoint($point) {
            // Удаляем информацию о точке из массива
            const index = points.findIndex((point) => point.$element.is($point));
            if (index !== -1) {
                points.splice(index, 1);
            }

            $point.remove();
        }
        $(document).on("click", ".delete-button", function() {
            $(this).parent().parent().remove();
        })
        $(window).on('resize', function () {
            const mapWidth = $mapContainer.width();
            const mapHeight = $mapContainer.height();

            // Обновляем позиции всех точек относительно новых размеров контейнера
            points.forEach((point) => {
                const xPercent = point.xPercent;
                const yPercent = point.yPercent;
                const xPixels = (xPercent / 100) * mapWidth;
                const yPixels = (yPercent / 100) * mapHeight;

                point.$element.css({
                    left: xPixels + 'px',
                    top: yPixels + 'px'
                });
            });
        });

        $select.on('change', function () {
            let current_index = $("#regions").attr("data-index");

            // Сохраняем позиции точек для текущей области
            pointPositions[current_index] = points.map(point => ({
                xPercent: point.xPercent,
                yPercent: point.yPercent
            }));

            let selectedValue = $(this).val();
            let selectedOption = $(this).find('option:selected');

            let selectedIndex = $(this).find('option').index(selectedOption);
            $(this).attr("data-index", selectedIndex)
            $(".point-container svg").addClass("hide");
            $(".point-container svg").eq(selectedIndex + 1).removeClass("hide");
            $(".region__name").text(selectedValue);
            $(".region__group").show();
            $('.point__mobile').hide();
            $('.point__mobile[data-id="' + selectedIndex + '"]').show();

            if (pointPositions[selectedIndex]) {
                // Если есть сохраненные позиции для выбранной области,
                // восстанавливаем позиции точек
                points.forEach((point, index) => {
                    if (pointPositions[selectedIndex][index]) {
                        const xPercent = pointPositions[selectedIndex][index].xPercent;
                        const yPercent = pointPositions[selectedIndex][index].yPercent;
                        const mapWidth = $mapContainer.width();
                        const mapHeight = $mapContainer.height();
                        const xPixels = (xPercent / 100) * mapWidth;
                        const yPixels = (yPercent / 100) * mapHeight;
                        point.$element.css({
                            left: xPixels + 'px',
                            top: yPixels + 'px'
                        });
                        point.xPercent = xPercent;
                        point.yPercent = yPercent;
                    }
                });
            }
        });

        $mapContainer.on('click', function (event) {
            if ($(window).width() < 769) {
                if ($(event.target).hasClass("point__mobile") || $(event.target).hasClass("pointInfoBlock") || $(event.target).hasClass("delete-button") || $(event.target).hasClass("pointInfoBlock__link") || $(event.target).hasClass("pointInfoBlock__title") || $(event.target).hasClass("pointInfoBlock__desc") || $(event.target).hasClass("pointInfoBlock__img")) {
                    return;
                } else {
                    let current_index = $("#regions").attr("data-index");
                    const offsetX = event.pageX - $mapContainer.offset().left;
                    const offsetY = event.pageY - $mapContainer.offset().top;
                    const mapWidth = $mapContainer.width();
                    const mapHeight = $mapContainer.height();
                    const offsetXPercent = (offsetX / mapWidth) * 100;
                    const offsetYPercent = (offsetY / mapHeight) * 100;
                    let id = current_index;
                    if (id) {
                        createPoint(id, offsetXPercent, offsetYPercent);
                    }
                }
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

                $(document).on('mouseenter', '.point__mobile', function () {
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
                $(document).on('mouseleave', '.point__mobile', function () {
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
