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
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-(--color-secondary)">
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
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-(--color-secondary)">
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
              <span className="w-28 shrink-0 text-xs font-medium text-(--status-default)">
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
            Нужно быстро добавить несколько одинаковых участков? Используйте{' '}
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
            формате JSON. Файл с повреждённой структурой загружен не будет.
          </p>

          <p>
            Кнопки <span className="text-(--color-active)">"↶"</span> и{' '}
            <span className="text-(--color-active)">"↷"</span>
            отменяют и повторяют последнее действие. Если бы в жизни так же работало — было бы
            идеально.
          </p>

          <p>
            Вы можете переключать тему приложения с помощью кнопок{' '}
            <span className="text-(--color-active)">"☀️"</span> и{' '}
            <span className="text-(--color-active)">"🌙"</span>. Берегите глаза — они вам ещё
            пригодятся.
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
              className="text-(--color-active) underline hover:opacity-80 transition"
            >
              samovichilias19life@gmail.com
            </a>
            <br />
            (Даже если ошибка «странная» или «наверное, я сам что-то нажал» — такие сообщения
            особенно ценны. Скриншоты или фото будут очень полезны.)
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
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
