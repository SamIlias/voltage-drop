import { LoadType, Section } from '@renderer/types'
import { ReportMeta } from './ReportContent'
import { getPrintStyles } from './hooks/getPrintStyles'

const fmtSafe = (v: number | null | undefined, d = 2) => (v == null ? '—' : Number(v).toFixed(d))

const renderMetaItem = (label: string, value: any, unit?: string) => `
      <div class="meta-item">
        <span>${label}</span>
        <b>${value ?? '—'} ${unit ?? ''}</b>
      </div>
    `

const LOAD_LABELS: Record<LoadType, string> = {
  [LoadType.Household]: '',
  [LoadType.Heating]: '(Н)',
  [LoadType.ElectricCar]: '(ЭМ)',
  [LoadType.Prom]: '(ПР)'
}

const renderLoadCell = (section: Section) => {
  if (!section.loads_kw || section.loads_kw.length === 0) {
    return `<span>—</span>`
  }

  return `
    <div class="load-cell">
      ${section.loads_kw
        .map((l) => {
          const label = LOAD_LABELS[l.type] ?? ''
          return `
            <span class="consumer">
              ${l.power} ${label}
            </span>
          `
        })
        .join('')}
    </div>
  `
}

const renderRows = (sections: Section[]) =>
  sections
    .map(
      (s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${s.prevPoleNumber} - ${s.poleNumber}</td>
          <td>${s.wire ?? '—'}</td>
          <td>${fmtSafe(s.results.Rsec, 3)}</td>
          <td>${fmtSafe(s.results.Psec_kw)}</td>
          <td>${s.length_m ?? '—'}</td>
          <td>${fmtSafe(s.results.Isec1)}</td>
          <td>${fmtSafe(s.results.dUsec)}</td>
          <td>${renderLoadCell(s)}</td>
          <td>${s.results.effectivePhaseCount ?? s.phases ?? '—'}</td>
        </tr>
      `
    )
    .join('')

export function generateReportHtml(meta: ReportMeta, sections: Section[]) {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<title>Отчёт по секциям</title>

<style>
${getPrintStyles()}
</style>

</head>
<body>

<div id="report-printable">
  <div class="report-card">
    <div class="header-row">
      <span>${meta.title || 'Параметры ВЛ'}</span>
      <span>${meta.date || ''}</span>
    </div>

    <div class="meta-row">

      <!-- Трансформатор -->
      <div>
        <p class="section-label">Трансформатор</p>
        <div class="meta-block">
          ${renderMetaItem('Мощность', meta.transformerPower_kva, 'кВА')}
          ${renderMetaItem('Схема', meta.transformerScheme)}
          ${renderMetaItem('Загрузка', fmtSafe(meta.transformerLoad), '%')}
        </div>
      </div>

      <!-- Линия -->
      <div>
        <p class="section-label">Линия</p>
        <div class="meta-block flex">
          <div>
            ${renderMetaItem('Ток 1 фазы', fmtSafe(meta.fullWorkCurrent), 'А')}
            ${renderMetaItem('cos φ', meta.cosPhi)}
            ${renderMetaItem('Длина линии', fmtSafe(meta.fullLength), 'м')}
          </div>
          <div>
            ${renderMetaItem('R линии', fmtSafe(meta.fullResistance), 'Ом')}
            ${renderMetaItem('ΔU', fmtSafe(meta.voltageDrop_v), 'В')}
            ${renderMetaItem(
              'ΔU%',
              fmtSafe(meta.voltageDrop_v ? (meta.voltageDrop_v / 220) * 100 : null),
              '%'
            )}
          </div>
        </div>
      </div>

      <!-- Нагрузки -->
      <div class="flex-1">
        <p class="section-label">Нагрузки</p>
        <div class="meta-block row">

          <div>
            ${renderMetaItem('NΣ', fmtSafe(meta.loadSummary?.totalCount, 0))}
            ${renderMetaItem('PΣ', fmtSafe(meta.loadSummary?.totalPower), 'кВт')}
            ${renderMetaItem('Kнагрев', fmtSafe(Number(meta.k_heatDec)) || null)}
          </div>

          <div>
            ${renderMetaItem('Nбыт', fmtSafe(meta.loadSummary?.household.count, 0))}
            ${renderMetaItem('Pбыт', fmtSafe(meta.loadSummary?.household.power))}
            ${renderMetaItem('Kодн.быт', fmtSafe(meta.loadSummary?.household.ksim))}
          </div>

          <div>
            ${renderMetaItem('Nнагр', fmtSafe(meta.loadSummary?.heating.count, 0))}
            ${renderMetaItem('Pнагр', fmtSafe(meta.loadSummary?.heating.power))}
            ${renderMetaItem('Kодн.нагр', fmtSafe(meta.loadSummary?.heating.ksim))}
          </div>

          <div>
            ${renderMetaItem('Nэл.авто', fmtSafe(meta.loadSummary?.electricCar.count, 0))}
            ${renderMetaItem('Pэл.авто', fmtSafe(meta.loadSummary?.electricCar.power))}
            ${renderMetaItem('Kодн.эл.авто', fmtSafe(meta.loadSummary?.electricCar.ksim))}
          </div>

          <div>
            ${renderMetaItem('Nпром', fmtSafe(meta.loadSummary?.prom.count, 0))}
            ${renderMetaItem('Pпром', fmtSafe(meta.loadSummary?.prom.power))}
            ${renderMetaItem('Kодн.пром', fmtSafe(meta.loadSummary?.prom.ksim))}
          </div>

        </div>
      </div>

      <!-- КЗ -->
      <div>
        <p class="section-label">Токи КЗ</p>
        <div class="meta-block">
          ${renderMetaItem('3ф', fmtSafe(meta.IkzSummary?.Ikz3), 'А')}
          ${renderMetaItem('2ф', fmtSafe(meta.IkzSummary?.Ikz2), 'А')}
          ${renderMetaItem('1ф', fmtSafe(meta.IkzSummary?.Ikz1), 'А')}
        </div>
      </div>

    </div>
  </div>

  <!-- TABLE -->
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Участок</th>
          <th>Провод</th>
          <th>R, Ом</th>
          <th>P, кВт</th>
          <th>L, м</th>
          <th>I, А</th>
          <th>ΔU, В</th>
          <th>Потребители</th>
          <th>Фаз</th>
        </tr>
      </thead>
      <tbody>
        ${renderRows(sections)}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Участков: ${sections.length}
  </div>

</div>

</body>
</html>
`
}
