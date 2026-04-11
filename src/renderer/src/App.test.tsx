import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { ThemeProvider } from './providers/theme/ThemeProvider'

const loadDataMock = jest.fn()
const AppTest = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

beforeEach(() => {
  window.api = {
    saveData: jest.fn(),
    loadData: loadDataMock
  } as any
})

describe('App', () => {
  test('renders add section button', () => {
    render(<AppTest />)

    expect(screen.getByText('+ Добавить участок')).toBeInTheDocument()
  })
})

test('adds new section', () => {
  render(<AppTest />)

  const button = screen.getByText('+ Добавить участок')

  fireEvent.click(button)

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBe(2)
})

test('removes section', () => {
  render(<AppTest />)

  const addBtn = screen.getByText('+ Добавить участок')

  fireEvent.click(addBtn)

  const removeButtons = screen.getAllByTestId('remove-section')

  fireEvent.click(removeButtons[0])

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBe(1)
})

test('calls saveData API', async () => {
  render(<AppTest />)

  const saveButton = screen.getByText('Сохранить')

  fireEvent.click(saveButton)

  expect(window.api.saveData).toHaveBeenCalled()
})

test('loads sections from API', async () => {
  const mockSections = [{ id: 1, loads_kw: [] }]

  loadDataMock.mockResolvedValue(mockSections)

  render(<AppTest />)

  const loadButton = screen.getByText('Загрузить')

  fireEvent.click(loadButton)

  expect(window.api.loadData).toHaveBeenCalled()
})

test('quick fill adds multiple sections', () => {
  render(<AppTest />)

  const addButton = screen.getByRole('button', { name: /добавить/i })

  fireEvent.click(addButton)

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBeGreaterThan(1)
})
