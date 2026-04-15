import '@testing-library/jest-dom'

HTMLDialogElement.prototype.showModal = jest.fn()
HTMLDialogElement.prototype.close = jest.fn()
window.HTMLElement.prototype.scrollIntoView = jest.fn()
