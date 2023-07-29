/**
 * @jest-environment jsdom
 */

import {fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Store from "../__mocks__/store.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    it("should not accepte invalid type file", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const fileInput = screen.getByTestId('file')
      const invalidFile = new File(["invalid content"], "invalid-file.txt", {
        type: "text/plain",
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileInput.addEventListener('change', handleChangeFile)
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      expect(handleChangeFile).toHaveBeenCalled()
      expect(fileInput.files[0].type).not.toMatch(/image\/(jpeg|jpg|png)/);
    })
    test('if I put a correct file, it should store it', () =>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = Store
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const fileInput = screen.getByTestId('file')
      const validFile = new File(["valid content"], "valid-file.jpg", {
        type: "image/jpg",
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileInput.addEventListener('change', handleChangeFile)
      fireEvent.change(fileInput, { target: { files: [validFile] } });
      expect(newBill.billId).not.toBe('null')
      expect(newBill.fileUrl).not.toBe('null')
      expect(newBill.fileName).not.toBe('null')
    })
  })
})
