/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js" 
import  Bills  from "../containers/Bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js"
import Store from "../__mocks__/store.js"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = [...dates].sort((a, b) => a - b)
      expect(dates).toEqual(datesSorted)
    })
    test("???", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const store = Store
      const bill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const listBills = await bill.getBills();
      const testList = [
        {
          "id": "47qAXb6fIm2zOKkLzMro",
          "vat": "80",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          "status": "En attente",
          "type": "Hôtel et logement",
          "commentary": "séminaire billed",
          "name": "encore",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "4 Avr. 04",
          "amount": 400,
          "commentAdmin": "ok",
          "email": "a@a",
          "pct": 20
        },
        {
          "id": "BeKy5Mo4jkmdfPGYpTxZ",
          "vat": "",
          "amount": 100,
          "name": "test1",
          "fileName": "1592770761.jpeg",
          "commentary": "plop",
          "pct": 20,
          "type": "Transports",
          "email": "a@a",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
          "date": "1 Jan. 01",
          "status": "Refused",
          "commentAdmin": "en fait non"
        },
        {
          "id": "UIUZtnPQvnbFnB0ozvJh",
          "name": "test3",
          "email": "a@a",
          "type": "Services en ligne",
          "vat": "60",
          "pct": 20,
          "commentAdmin": "bon bah d'accord",
          "amount": 300,
          "status": "Accepté",
          "date": "3 Mar. 03",
          "commentary": "",
          "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
        },
        {
          "id": "qcCK3SzECmaZAGRrHjaC",
          "status": "Refused",
          "pct": 20,
          "amount": 200,
          "email": "a@a",
          "name": "test2",
          "vat": "40",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2 Fév. 02",
          "commentAdmin": "pas la bonne facture",
          "commentary": "test2",
          "type": "Restaurants et bars",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
        }]
      
      expect(listBills).toEqual(testList)
    })
    it('should handle corrupted data in formatDate function', async () => {
      const corruptedBill = {
        "id": "invalidBillId",
        "vat": "20",
        "fileUrl": "https://test.storage.tld/invalid-bill.jpg",
        "status": "pending",
        "type": "Invalid Type",
        "commentary": "corrupted data",
        "name": "invalid bill",
        "fileName": "invalid-bill.jpg",
        "date": "Invalid Date Format",
        "amount": 100,
        "commentAdmin": "corruption",
        "email": "a@a",
        "pct": 20
      };
    
      const mockedBills = {
        list() {
          return Promise.resolve([...bills, corruptedBill]);
        },
        create: jest.fn(),
        update: jest.fn(),
      };
    
      // Mock the localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
    
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
    
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    
      const bill = new Bills({
        document, onNavigate, store: { bills: () => mockedBills }, localStorage: window.localStorage // Adjusted the 'store' property
      });
    
      const listBills = await bill.getBills();
    
      const foundCorruptedBill = listBills.find((bill) => bill.id === corruptedBill.id);
    
      expect(foundCorruptedBill).toBeDefined();
    });
    it('should navigate to NewBill page when "New Bill" button is clicked', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
    
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
    
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    
      const bill = new Bills({
        document, onNavigate, store: Store, localStorage: window.localStorage
      });
    
      const onNavigateSpy = jest.spyOn(bill, 'onNavigate');
    
      const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
      fireEvent.click(buttonNewBill);
    
      expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    });
  })
})
