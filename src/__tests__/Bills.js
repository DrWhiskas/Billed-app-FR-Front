/**
 * @jest-environment jsdom
 */
/*
import "@testing-library/jest-dom";
import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)



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
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe('When I click on the button New Bill' , () =>{
    test('Then it should go to the new bill form', () => {
      Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			// simuler la page html Bill
			const html = BillsUI({ data: bills });
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			document.body.innerHTML = html;
			// simuler la page new bill
			const store = jest.fn();
			const newBill = new Bills({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			});
			//simuler le boutton
			const buttonSubmit = screen.getByTestId('btn-new-bill');
			const handleClick = jest.fn(newBill.handleClickNewBill);

			buttonSubmit.addEventListener('click', handleClick);
			fireEvent.click(buttonSubmit);
			expect(handleClick).toHaveBeenCalled();
		});
     describe("When I click on the icon eye button", () => {
      test("A modal should open", () => {
        $.fn.modal = jest.fn();
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const billsContainer = new Bills({
          document,
          onNavigate,
          store: store,
          localStorage: window.localStorage,
        });

        const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(e.target));
        const eye = screen.getAllByTestId("icon-eye")[0];
        eye.addEventListener("click", handleClickIconEye);
        fireEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();

        eye.addEventListener("click", (e) => {
          handleClickIconEye(e.target);
          const modale = screen.getByTestId("modaleFile");
          expect(modale).toHaveClass("show");
        });
      });
    });

    test("When I click on new bill button", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

      document.body.innerHTML = BillsUI({ data: bills });

      const Bill = new Bills({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage,
      });

      const iconNewBill = screen.getByTestId("btn-new-bill");
      const handleNewBill = jest.fn((e) => {
        Bill.handleClickNewBill(e.target);
      });

      iconNewBill.addEventListener("click", handleNewBill);
      fireEvent.click(iconNewBill);

      expect(handleNewBill).toHaveBeenCalled();
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    
  })
   describe("Given I am a user connected as Employee", () => {
      describe("When I navigate to Bill", () => {
        test("fetches bills from mock API GET", async () => {
          localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.append(root)
          router()
          window.onNavigate(ROUTES_PATH.Bills)

          await waitFor(() => screen.getByText("Transports"))
          const nouvelleNote = await screen.getByText("Nouvelle note de frais")
          expect(nouvelleNote).toBeTruthy()
          expect(screen.getAllByTestId("btn-new-bill")).toBeTruthy()

        })
        describe("When an error occurs on API", () => {

          beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(
                window,
                'localStorage',
                {value: localStorageMock}
            )
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee',
              email: "a@a"
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)
            router()
          })

          test("fetches bills from an API and fails with 404 message error", async () => {
            mockStore.bills.mockImplementationOnce(() => {
              return {
                list : () =>  {
                  return Promise.reject(new Error("Erreur 404"))
                }
              }})
            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
          })

          test("fetches messages from an API and fails with 500 message error", async () => {

            mockStore.bills.mockImplementationOnce(() => {
              return {
                list : () =>  {
                  return Promise.reject(new Error("Erreur 500"))
                }
              }})

            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
            })
          })
        })
      })
})

describe('Giver I am connected as Employee', () =>{
  describe('When I navigate to the bill page', ()=>{
    test('fetchets bills from mock API GET ', async()=>{
      document.body.innerHTML = BillsUI({ data: bills });
			localStorage.setItem(
				'user',
				JSON.stringify({ type: 'Employee', email: 'a@a' })
			);
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await waitFor(() => screen.getByText('Mes notes de frais'));
			const contentPending = await screen.getByText('Nouvelle note de frais');
			expect(contentPending).toBeTruthy();
			expect(screen.getByTestId('btn-new-bill')).toBeTruthy();
    });
    describe('When an error occurs on API',()=>{
      beforeEach(() => {
				jest.spyOn(store, 'bills');
				Object.defineProperty(window, 'localStorage', {
					value: localStorageMock,
				});
				window.localStorage.setItem(
					'user',
					JSON.stringify({
						type: 'Employee',
						email: 'a@a',
					})
				);
				const root = document.createElement('div');
				root.setAttribute('id', 'root');
				document.body.appendChild(root);
				router();
			});
       test('fetches bills from an API and fails with 404 message error', async () => {
					store.bills.mockImplementationOnce(() => {
						return {
							list: () => {
								return Promise.reject(new Error('Erreur 404'));
							},
						};
					});
					window.onNavigate(ROUTES_PATH.Bills);
					await new Promise(process.nextTick);
					document.body.innerHTML = BillsUI({ error: 'Erreur 404' });
					const message = await screen.getByText(/Erreur 404/);
					expect(message).toBeTruthy();
					expect(message).toMatchInlineSnapshot(`
          <div
            data-testid="error-message"
          >
            
                    Erreur 404
                  
          </div>
        `);
				});
        test('fetches messages from an API and fails with 500 message error', async () => {
					store.bills.mockImplementationOnce(() => {
						return {
							list: () => {
								return Promise.reject(new Error('Erreur 500'));
							},
						};
					});
					window.onNavigate(ROUTES_PATH.Bills);
					await new Promise(process.nextTick);
					document.body.innerHTML = BillsUI({ error: 'Erreur 500' });
					const message = await screen.getByText(/Erreur 500/);
					expect(message).toBeTruthy();
					expect(message).toMatchInlineSnapshot(`
          <div
            data-testid="error-message"
          >
            
                    Erreur 500
                  
          </div>
        `);
				});
    })
  })
})
})

 describe('Given I am a user connected as Employee', () => {
		describe('When I navigate to Bill', () => {
			test('fetches bills from mock API GET', async () => {
				localStorage.setItem(
					'user',
					JSON.stringify({ type: 'Employee', email: 'a@a' })
				);
				const root = document.createElement('div');
				root.setAttribute('id', 'root');
				document.body.append(root);
				router();
				window.onNavigate(ROUTES_PATH.Bills);

				await waitFor(() => screen.getByText('Transports'));
				const nouvelleNote = await screen.getByText('Nouvelle note de frais');
				expect(nouvelleNote).toBeTruthy();
				expect(screen.getAllByTestId('btn-new-bill')).toBeTruthy();
			});
			describe('When an error occurs on API', () => {
				beforeEach(() => {
					jest.spyOn(mockStore, 'bills');
					Object.defineProperty(window, 'localStorage', {
						value: localStorageMock,
					});
					window.localStorage.setItem(
						'user',
						JSON.stringify({
							type: 'Employee',
							email: 'a@a',
						})
					);
					const root = document.createElement('div');
					root.setAttribute('id', 'root');
					document.body.appendChild(root);
					router();
				});

				test('fetches bills from an API and fails with 404 message error', async () => {
					mockStore.bills.mockImplementationOnce(() => {
						return {
							list: () => {
								return Promise.reject(new Error('Erreur 404'));
							},
						};
					});
					window.onNavigate(ROUTES_PATH.Bills);
					await new Promise(process.nextTick);
					const message = await screen.getByText(/Erreur 404/);
					expect(message).toBeTruthy();
				});

				test('fetches messages from an API and fails with 500 message error', async () => {
					mockStore.bills.mockImplementationOnce(() => {
						return {
							list: () => {
								return Promise.reject(new Error('Erreur 500'));
							},
						};
					});

					window.onNavigate(ROUTES_PATH.Bills);
					await new Promise(process.nextTick);
					const message = await screen.getByText(/Erreur 500/);
					expect(message).toBeTruthy();
				});
			});
		})
  })

*/

/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)

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
      expect(windowIcon.classList).toContain('active-icon');
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills }) //Génére l'html de la page billsUI avc les données de bills
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("When click on the eyes button", () => {
      test("It open the modal", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        $.fn.modal = jest.fn();

        const store = null
        const bill = new Bills({
          document, onNavigate, store, localStorage: window.localStorage
        })

        const eye = screen.getAllByTestId('icon-eye')
        const handleClickIconEye = jest.fn(bill.handleClickIconEye(eye[0]))
        eye[0].addEventListener('click', handleClickIconEye)
        userEvent.click(eye[0])
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = document.getElementById('modaleFile')
        expect(modale).toBeTruthy()
      })
    })

    describe("When click the new bill button", () => {
      test("Then new bills form should open", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)

        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const btnNewBill = screen.getByTestId('btn-new-bill')
        userEvent.click(btnNewBill);
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        const url = window.location.href;
        expect(url).toEqual("http://localhost/"+ROUTES_PATH.NewBill);
      })
    })

    describe("Given I am a user connected as Employee", () => {
      describe("When I navigate to Bill", () => {
        test("fetches bills from mock API GET", async () => {
          localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.append(root)
          router()
          window.onNavigate(ROUTES_PATH.Bills)

          await waitFor(() => screen.getByText("Transports"))
          const nouvelleNote = await screen.getByText("Nouvelle note de frais")
          expect(nouvelleNote).toBeTruthy()
          expect(screen.getAllByTestId("btn-new-bill")).toBeTruthy()

        })
        describe("When an error occurs on API", () => {

          beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(
                window,
                'localStorage',
                {value: localStorageMock}
            )
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee',
              email: "a@a"
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)
            router()
          })

          test("fetches bills from an API and fails with 404 message error", async () => {
            mockStore.bills.mockImplementationOnce(() => {
              return {
                list : () =>  {
                  return Promise.reject(new Error("Erreur 404"))
                }
              }})
            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
          })

          test("fetches messages from an API and fails with 500 message error", async () => {

            mockStore.bills.mockImplementationOnce(() => {
              return {
                list : () =>  {
                  return Promise.reject(new Error("Erreur 500"))
                }
              }})

            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
          })

        })
      })
    })
  })
})