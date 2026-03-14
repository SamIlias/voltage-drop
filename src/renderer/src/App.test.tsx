import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

const loadSectionsMock = jest.fn()

beforeEach(() => {
  window.api = {
    saveSections: jest.fn(),
    loadSections: loadSectionsMock
  } as any
})

describe('App', () => {
  test('renders add section button', () => {
    render(<App />)

    expect(screen.getByText('+ Добавить участок')).toBeInTheDocument()
  })
})

test('adds new section', () => {
  render(<App />)

  const button = screen.getByText('+ Добавить участок')

  fireEvent.click(button)

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBe(2)
})

test('removes section', () => {
  render(<App />)

  const addBtn = screen.getByText('+ Добавить участок')

  fireEvent.click(addBtn)

  const removeButtons = screen.getAllByText('✕')

  fireEvent.click(removeButtons[0])

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBe(1)
})

test('calls saveSections API', async () => {
  render(<App />)

  const saveButton = screen.getByText('Сохранить')

  fireEvent.click(saveButton)

  expect(window.api.saveSections).toHaveBeenCalled()
})

test('loads sections from API', async () => {
  const mockSections = [{ id: 1, loads_kw: [] }]

  loadSectionsMock.mockResolvedValue(mockSections)

  render(<App />)

  const loadButton = screen.getByText('Загрузить')

  fireEvent.click(loadButton)

  expect(window.api.loadSections).toHaveBeenCalled()
})

test('quick fill adds multiple sections', () => {
  render(<App />)

  const addButton = screen.getByRole('button', { name: /добавить/i })

  fireEvent.click(addButton)

  const sections = screen.getAllByTestId('section-block')

  expect(sections.length).toBeGreaterThan(1)
})
