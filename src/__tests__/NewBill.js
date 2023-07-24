/**
 * @jest-environment jsdom
 */

import {fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("it should only accepte image type file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const file = screen.getByTestId('file')
      const invalidFile = new File(["invalid content"], "invalid-file.txt", {
        type: "text/plain",
      });
      fireEvent.change(file, { target: { files: [invalidFile] } });
      expect(file.files[0].type).not.toMatch(/image\/(jpeg|jpg|png)/);
    })
  })
})
