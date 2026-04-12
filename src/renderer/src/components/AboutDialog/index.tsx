import { useEffect, useRef } from 'react'

const guideItems = [
  {
    label: 'Название линии',
    text: 'Введите название расчёта — используется как имя файла при сохранении и в заголовке отчёта.'
  },
  { label: 'Дата', text: 'Устанавливается автоматически. При необходимости можно задать вручную.' },
  { label: 'cos φ', text: 'Коэффициент мощности для расчёта. По умолчанию 0,9.' },
  {
    label: 'dU% доп',
    text: 'Допустимое значение потери напряжения в рамках расчёта. Устанавливается вручную.'
  },
  {
    label: 'Мощность тр-ра',
    text: 'Выберите мощность трансформатора для определения его загрузки и расчёта токов к.з.'
  },
  {
    label: 'Схема обм.',
    text: 'Схема обмотки трансформатора — также используется при расчёте токов к.з.'
  },
  { label: 'Кодн', text: 'Коэффициенты одновременности...' },
  { label: 'Кнагрев', text: 'Понижающий коэффициент для нагрузок типа «нагрев».' }
]

export default function AboutDialog({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    isOpen ? dialog.showModal() : dialog.close()
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    const rect = dialogRef.current!.getBoundingClientRect()
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom

    if (outside) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="
        w-full max-w-xl rounded-2xl p-0 shadow-2xl
        bg-(--bg) text-(--text)
        border border-(--color-border)
        backdrop:bg-black/50
      "
    >
      <div className="flex gap-4 border-b border-(--color-border) p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--bg-section) text-xl">
          ⚡
        </div>

        <div className="flex flex-col gap-3">
          <p className="mb-0.5 text-md text-(--text)">
            Программа расчёта параметров линии электропередачи 0,4 кВ
          </p>

          <div>
            <p className="rounded-full bg-(--bg-section) py-0.5 text-xs">
              Версия программы: <span className="text-(--status-ok)">v 1.0.0</span>
            </p>

            <p className="rounded-full bg-(--bg-section) py-0.5 text-xs">
              {'Техническая поддержка: '}
              <a
                href="mailto:Samovichilias19life@gmail.com"
                className="text-xs text-(--status-default) hover:underline"
              >
                Samovichilias19life@gmail.com
              </a>{' '}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            self-start rounded-md p-1
            text-(--color-secondary)
            transition hover:bg-(--bg-section) hover:text-(--text)
          "
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        <p className="mb-5 text-sm leading-relaxed text-(--color-secondary)">
          Данная программа предназначена для теоретического обоснования выбора сечений проводников,
          проверки допустимых потерь напряжения, оценки загрузки силового трансформатора, а также
          для расчёта токов короткого замыкания в сетях 0,4 кВ.
        </p>

        {/* Load types */}
        <p className="mt-4 mb-2.5 text-[13px] font-semibold uppercase tracking-widest text-(--status-default)">
          Виды нагрузок
        </p>

        <div className="mb-5 grid grid-cols-4 gap-2">
          {[
            ['Быт', 'бытовая'],
            ['Нагрев', 'нагревательная'],
            ['Эл. авто', 'зарядные уст.'],
            ['Пром', 'производственная']
          ].map(([title, sub]) => (
            <div key={title} className="rounded-lg bg-(--bg-section) p-2.5 text-center">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-[11px] text-(--color-secondary)">{sub}</p>
            </div>
          ))}
        </div>

        {/* Guide */}
        <p className="mt-4 mb-2.5 text-[13px] font-semibold uppercase tracking-widest text-(--status-default)">
          Руководство по работе
        </p>

        <div className="mb-5 overflow-hidden rounded-xl border border-(--color-border)">
          {guideItems.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-baseline gap-3 px-4 py-2.5 ${
                i !== 0 ? 'border-t border-(--color-border)' : ''
              }`}
            >
              <span className="w-28 shrink-0 text-xs font-medium text-(--color-active)">
                {item.label}
              </span>

              <span className="text-sm leading-relaxed text-(--color-secondary)">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="text-sm leading-relaxed text-(--color-secondary) space-y-5">
          <p>Все расчёты происходят автоматически при любом изменении параметров линии.</p>

          <div>
            <p className="mb-2">Каждый участок описывается отдельной секцией, которая включает:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                блок ввода параметров (значения вводятся вручную; если что-то пошло не так —
                программа вежливо сообщит об этом, без осуждения)
              </li>
              <li>
                блок ввода нагрузок (сюда добавляются нагрузки, присоединённые к конечной опоре
                участка)
              </li>
              <li>
                блок результатов (здесь отображаются рассчитанные параметры участка — всё честно и
                прозрачно)
              </li>
            </ul>
          </div>

          <p>
            Нажмите кнопку <span className="text-(--color-active)">"+ Добавить участок"</span>,
            чтобы создать новый участок линии. Он унаследует длину, марку провода и количество фаз
            от предыдущего. Нумерация выполняется автоматически.
          </p>

          <p>
            Если нужно быстро добавить несколько одинаковых участков используйте{' '}
            <span className="text-(--color-active)">
              "Открыть окно быстрого добавления участка"
            </span>
            , заполните поля и нажмите <span className="text-(--color-active)">"Добавить"</span>.
            Экономит время и нервы.
          </p>

          <p>
            Программа автоматически строит схему линии. Нажмите на любую опору — и вы перейдёте к
            вводу параметров пролёта, для которого она является конечной.
          </p>

          <p>
            Для сохранения расчёта используйте{' '}
            <span className="text-(--color-active)">"Сохранить"</span>. Для загрузки —{' '}
            <span className="text-(--color-active)">"Загрузить"</span>. Файлы сохраняются локально в
            формате JSON. Файл с повреждённой структурой или неправильным форматом загружен не
            будет.
          </p>

          <p>
            Кнопки <span className="text-(--color-active)">"↶"</span> и{' '}
            <span className="text-(--color-active)">"↷"</span>
            отменяют и повторяют последнее действие. Эх, если бы в жизни можно было также...{' '}
          </p>

          <p>
            Вы можете переключать тему приложения с помощью кнопок{' '}
            <span className="text-(--color-active)">"☀️"</span> и{' '}
            <span className="text-(--color-active)">"🌙"</span>. Берегите глаза — они вам ещё
            пригодятся. И сядьте прямо - позвоночник - основа здоровья!
          </p>

          <p>
            Для получения отчёта нажмите{' '}
            <span className="text-(--color-active)">"Сформировать отчёт"</span>. Вы получите сводную
            информацию по линии с возможностью печати.
          </p>

          <p className="text-sm leading-relaxed text-(--color-secondary)">
            При возникновении любой ошибки в работе приложения, пожалуйста, сообщите об этом
            разработчику. Это поможет сделать инструмент стабильнее и удобнее для всех
            пользователей.
            <br />
            <br />
            Связаться можно по электронной почте:{' '}
            <a
              href="mailto:samovichilias19life@gmail.com"
              className="text-(--status-default) underline hover:opacity-80 transition"
            >
              samovichilias19life@gmail.com
            </a>
            <br />
            (Даже если ошибка «странная» или «наверное, я сам что-то нажал» — такие сообщения
            особенно ценны. Скриншоты или фото будут очень полезны.)
          </p>
        </div>

        {/* Reference */}
        <p className="mt-4 mb-2.5 text-[13px] font-semibold uppercase tracking-widest text-(--status-default)">
          Справочник
        </p>

        <div className="space-y-6 text-sm">
          <div>
            <p className="mb-2 font-medium text-(--text)">Проводники</p>
            <div className="overflow-auto rounded-xl border border-(--color-border)">
              <table className="w-full text-xs">
                <thead className="bg-(--bg-section)">
                  <tr>
                    <th className="p-2 text-left">Марка</th>
                    <th className="p-2 text-left">Сечение</th>
                    <th className="p-2 text-left">Ом/км</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['A', 16, 1.84],
                    ['A', 25, 1.165],
                    ['A', 35, 0.85],
                    ['A', 50, 0.59],
                    ['A', 70, 0.42],
                    ['A', 95, 0.34],
                    ['A', 120, 0.25],
                    ['A', 150, 0.2],

                    ['AC', 16, 2.77],
                    ['AC', 25, 1.8],
                    ['AC', 35, 1.76],
                    ['AC', 50, 0.79],
                    ['AC', 70, 0.43],
                    ['AC', 95, 0.32],
                    ['AC', 120, 0.25],
                    ['AC', 150, 0.2],

                    ['КЛ', 16, 1.91],
                    ['КЛ', 25, 1.2],
                    ['КЛ', 35, 0.87],
                    ['КЛ', 50, 0.64],
                    ['КЛ', 70, 0.44],
                    ['КЛ', 95, 0.34],
                    ['КЛ', 120, 0.25],
                    ['КЛ', 150, 0.2],
                    ['КЛ', 185, 0.16],

                    ['САСП', 16, 1.91],
                    ['САСП', 25, 1.2],
                    ['САСП', 35, 0.868],
                    ['САСП', 50, 0.641],
                    ['САСП', 70, 0.443],
                    ['САСП', 95, 0.32],
                    ['САСП', 120, 0.253],

                    ['СИП', 16, 1.91],
                    ['СИП', 25, 1.2],
                    ['СИП', 35, 0.868],
                    ['СИП', 50, 0.641],
                    ['СИП', 70, 0.443],
                    ['СИП', 95, 0.32],
                    ['СИП', 120, 0.253]
                  ].map(([m, s, r], i) => (
                    <tr key={i} className="border-t border-(--color-border)">
                      <td className="p-2">{m}</td>
                      <td className="p-2">{s}</td>
                      <td className="p-2">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-(--text)">Сопротивления трансформаторов</p>
            <div className="overflow-auto rounded-xl border border-(--color-border)">
              <table className="w-full text-xs">
                <thead className="bg-(--bg-section)">
                  <tr>
                    <th className="p-2 text-left">Схема</th>
                    <th className="p-2 text-left">кВА</th>
                    <th className="p-2 text-left">Z₁</th>
                    <th className="p-2 text-left">Z₀</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Y/Yo', 25, 0.288, 1.04],
                    ['Y/Yo', 40, 0.18, 0.65],
                    ['Y/Yo', 63, 0.114, 0.411],
                    ['Y/Yo', 100, 0.07, 0.26],
                    ['Y/Yo', 160, 0.045, 0.162],
                    ['Y/Yo', 250, 0.0288, 0.104],
                    ['Y/Yo', 400, 0.018, 0.065],
                    ['Y/Yo', 630, 0.014, 0.042],
                    ['Y/Yo', 1000, 0.0088, 0.027],

                    ['Δ/Y', 400, 0.018, 0.019],
                    ['Δ/Y', 630, 0.014, 0.014],
                    ['Δ/Y', 1000, 0.0088, 0.009]
                  ].map(([s, p, z1, z0], i) => (
                    <tr key={i} className="border-t border-(--color-border)">
                      <td className="p-2">{s}</td>
                      <td className="p-2">{p}</td>
                      <td className="p-2">{z1}</td>
                      <td className="p-2">{z0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-(--text)">Коэффициенты одновременности</p>
            <div className="overflow-auto rounded-xl border border-(--color-border)">
              <table className="w-full text-xs">
                <thead className="bg-(--bg-section)">
                  <tr>
                    <th className="p-2">Nпром.</th>
                    <th className="p-2">Кодн пром</th>
                    <th className="p-2">Nбыт</th>
                    <th className="p-2">Кодн быт</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [2, 0.85, 2, 0.75],
                    [3, 0.8, 3, 0.64],
                    [5, 0.75, 5, 0.53],
                    [7, 0.7, 7, 0.47],
                    [10, 0.65, 10, 0.42],
                    [15, 0.6, 15, 0.37],
                    [20, 0.55, 20, 0.34],
                    [50, 0.47, 50, 0.27],
                    [100, 0.4, 100, 0.24],
                    [200, 0.35, 200, 0.2],
                    [500, 0.3, 500, 0.18]
                  ].map(([p, kp, b, kb], i) => (
                    <tr key={i} className="border border-(--color-border)">
                      <td className="p-2 border border-(--color-border)">{p}</td>
                      <td className="p-2 border border-(--color-border)">{kp}</td>
                      <td className="p-2 border border-(--color-border)">{b}</td>
                      <td className="p-2 border border-(--color-border)">{kb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-(--text)">Токи короткого замыкания</p>

            <div className="space-y-2 text-xs text-(--color-secondary)">
              <p>
                <b>Трёхфазное:</b> Ikz3 = Uл / (1.73 * (√(Rл² + Xл²) + Zт))
              </p>
              <p>
                <b>Двухфазное:</b> Ikz2 = Ikz3 × 0.866
              </p>
              <p>
                <b>Однофазное:</b> Ikz1 = Uф / (√((2Rл)² + Xл²) + Zт0 / 3)
              </p>

              <div className="mt-2">
                <p>Uл = 400 В, Uф = 230 В</p>
                <p>Xл ≈ 0.3 × L</p>
              </div>
            </div>
          </div>
        </div>

        {/* License */}
        <p className="mt-4 mb-2.5 text-[13px] font-semibold uppercase tracking-widest text-(--status-default)">
          Лицензия
        </p>

        <div className="space-y-4 text-sm text-(--color-secondary) leading-relaxed">
          <div className="rounded-xl border border-(--color-border) p-4 bg-(--bg-section)">
            <p>Copyright (c) 2026 Samovich Ilya</p>

            <p className="mt-2 font-medium text-(--text)">Разрешается:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Свободное использование программного обеспечения в личных, учебных и коммерческих
                целях
              </li>
              <li>Использование в организациях и на предприятиях</li>
              <li>Бесплатное распространение программы без ограничений</li>
            </ul>

            <p className="mt-2 font-medium text-(--text)">Запрещается:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Продажа программы</li>
              <li>Распространение программы за плату</li>
              <li>
                Включение программы в состав платных продуктов или услуг без письменного разрешения
                автора
              </li>
            </ul>

            <p className="mt-2">
              Программа предоставляется «как есть», без каких-либо гарантий. Автор не несёт
              ответственности за возможный ущерб, связанный с использованием программы.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-2">
          <button
            onClick={onClose}
            className="
              rounded-lg px-6 py-2 text-sm font-medium
              bg-(--bg-section)
              text-(--color-active)
              transition
              hover:bg-(--color-hover)
            "
          >
            Закрыть
          </button>
        </div>
      </div>
    </dialog>
  )
}
