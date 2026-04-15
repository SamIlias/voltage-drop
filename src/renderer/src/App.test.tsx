import { render, screen, fireEvent, act } from '@testing-library/react'
import App from './App'
import { ThemeProvider } from './providers/theme/ThemeProvider'

const loadDataMock = jest.fn()

let id = 0
jest.mock('uuid', () => ({
  v4: () => {
    id += 1
    return `${id + 1}`
  }
}))

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

test('removes section', async () => {
  render(<AppTest />)

  const addBtn = screen.getByText('+ Добавить участок')

  await act(async () => {
    fireEvent.click(addBtn)
  })

  const removeButtons = screen.getAllByTestId('remove-section')

  await act(async () => {
    fireEvent.click(removeButtons[0])
  })

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBe(1)
})

test('calls saveData API', async () => {
  render(<AppTest />)

  const saveButton = screen.getByText('Сохранить')

  await act(async () => {
    fireEvent.click(saveButton)
  })

  expect(window.api.saveData).toHaveBeenCalled()
})

test('loads sections from API', async () => {
  const mockSections = [{ id: '1l', loads_kw: [] }]

  loadDataMock.mockResolvedValue(mockSections)

  render(<AppTest />)

  const loadButton = screen.getByText('Загрузить')

  await act(async () => {
    fireEvent.click(loadButton)
  })

  expect(window.api.loadData).toHaveBeenCalled()
})

test('quick fill adds multiple sections', async () => {
  render(<AppTest />)

  const addButton = screen.getByRole('button', { name: /добавить/i })

  await act(async () => {
    fireEvent.click(addButton)
  })

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBeGreaterThan(1)
})
