/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import BillsUI from '../views/BillsUI.js';
import Bills from '../containers/Bills.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store';
import store from '../__mocks__/store';
import { bills } from '../fixtures/bills';
import router from '../app/Router';

jest.mock('../app/store', () => mockStore);


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form should be displayed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
	  
	  const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      expect(formNewBill).toBeTruthy;
      //to-do write assertion
    })
	test('Then email icon in vertical layout should be highlighted',  async () =>{
		Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'));
      const windowIcon = screen.getByTestId('icon-mail');
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
	});
  })
  describe('When I want to change the file', () => {
		test('Then It should create a new bill file with a valid extention', () => {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			// configuration de la page new bill
			const html = NewBillUI();
			document.body.innerHTML = html;
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			//const store = jest.fn();
			const newbill = new NewBill({
				document,
				onNavigate,
				store: mockStore,
				localStorage: window.localStorage,
			});
			 const handleChangeFile = jest.fn((e) => newbill.handleChangeFile(e));

				const fileInput = screen.getByTestId('file');
				fileInput.addEventListener('change', handleChangeFile);

				fireEvent.change(fileInput, {
					target: {
						files: [
							new File(['test'], 'test.jpg', {
								type: 'image/jpeg',
							}),
						],
					},
				});

				expect(handleChangeFile).toHaveBeenCalled();

				expect(fileInput.files[0].name).toBe('test.jpg');
		})
		test('Its should not send', ()=>{
			const store = {
				bills: jest.fn(() => ({
					create: jest.fn(() =>
						Promise.resolve({ fileUrl: 'test', key: 'test' })
					),
				})),
			};
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			const html = NewBillUI();
			document.body.innerHTML = html;
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			//const store = jest.fn();
			const newbill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			});

			// Mock the alert function
			const alertMock = jest
				.spyOn(window, 'alert')
				.mockImplementation(() => {});

			// Get the file input and set a file with an invalid extension
			const fileInput = screen.getByTestId('file');
			const file = new File(['test'], 'test.gif', { type: 'image/gif' });
			fireEvent.change(fileInput, { target: { files: [file] } });

			// Make sure the alert is shown with the correct message
			expect(alertMock).toHaveBeenCalledWith(
				'Format du fichier invalide, veuillez choisir un format de type : png, jpg ou jpeg'
			);

			// Make sure the file was not sent
			expect(store.bills().create).not.toHaveBeenCalled();

			// Restore the mock
			alertMock.mockRestore();
		})
		
	})
	describe('When I submit the new bill form', () => {
		test('Then the handleSubmit method should be called', () => {
			const html = NewBillUI();
			const testUser = {
				type: 'Employee',
				email: 'test@test.com',
			};
			window.localStorage.setItem('user', JSON.stringify(testUser));
			document.body.innerHTML = html;
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const newBill = new NewBill({
				document,
				onNavigate,
				firestore: null,
				localStorage: window.localStorage,
			});
			const form = document.querySelector(`form[data-testid="form-new-bill"]`);
			const handleSubmitSpy = jest.spyOn(newBill, 'handleSubmit');
			form.addEventListener('submit', handleSubmitSpy);
			fireEvent.submit(form);
			expect(handleSubmitSpy).toHaveBeenCalled();
			//expect(handleChangeFile);
		});
	});
})
  /*
  describe('When I do not fill fields and I click on the submit button', () =>{
	test('Then It should not send the form', () =>{
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
		});
		window.localStorage.setItem(
			'user',
			JSON.stringify({
				type: 'Employee',
				email:'test@test.com'
			})
		);
		// configuration de la page new bill
		const html = NewBillUI();
		document.body.innerHTML = html;
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};
		const store = jest.fn();
		const newBill = new NewBill({
			document,
			onNavigate,
			store,
			localStorage: window.localStorage,
		});
		

		const form = screen.getByTestId('form-new-bill');
		expect(form).toBeTruthy();
		const handleSubmit = jest.fn();
		newBill.fileName = null;
		const sendButton = screen.getByTestId('btn-send-bill')
		sendButton.addEventListener('click', handleSubmit(newBill.handleSubmit))
		expect(handleSubmit).toHaveBeenCalled()
		expect(screen.getByTestId('form-new-bill')).toBeTruthy()
	})
  })
  describe('When I want to change the file', () =>{
	test('Then It should create a new bill file with a valid extention', () =>{
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
		});
		window.localStorage.setItem(
			'user',
			JSON.stringify({
				type: 'Employee',
			})
		);
		// configuration de la page new bill
		const html = NewBillUI();
		document.body.innerHTML = html;
		const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};
		const store = jest.fn();
		const newbill = new NewBill({
			document,
			onNavigate,
			store,
			localStorage: window.localStorage,
		});
		const handleChangeFile = jest.fn(newbill.handleChangeFile)
		const fileInput = screen.getByTestId('file')
		const file = new File(['test'], 'test.png', { type: 'image/png'})

		const newFileName = file.name
		const newFileNameSplit = newFileName.split('.').pop()
		const newFileExtentionsValid = ['jpg', 'png', 'jpeg'];


		fileInput.addEventListener('change', handleChangeFile)

		fireEvent.change(fileInput, {target: { files: [file] }})

		const typesFiles = 'image/png';

		let image = screen.getByTestId('file')
		expect(image.files[0].type).toEqual(typesFiles);

		expect(newFileExtentionsValid).toContain(newFileNameSplit);;
	})
  })
  describe('When I submit the new bill form', () => {
			test('Then the handleSubmit method should be called', () => {
				const html = NewBillUI();
				const testUser = {
					type: 'Employee',
					email: 'test@test.com',
				};
				window.localStorage.setItem('user', JSON.stringify(testUser));
				document.body.innerHTML = html;
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname });
				};
				const newBill = new NewBill({
					document,
					onNavigate,
					firestore: null,
					localStorage: window.localStorage,
				});
				const form = document.querySelector(
					`form[data-testid="form-new-bill"]`
				);
				const handleSubmitSpy = jest.spyOn(newBill, 'handleSubmit');
				form.addEventListener('submit', handleSubmitSpy);
				fireEvent.submit(form);
				expect(handleSubmitSpy).toHaveBeenCalled();
				//expect(handleChangeFile);
			});
		})
})*/
			describe('Given I am a user connected as employee', () => {
				describe('When I navigate to NewBill', () => {
					test('fetches bills from mock API POST', async () => {
						const postSpy = jest.spyOn(store, 'bills');
						const bills = store.bills();

						expect(postSpy).toHaveBeenCalledTimes(1);
						expect(bills.update.length).toBe(1);
					});
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
              list: () => {
                return Promise.reject(new Error("Erreur 404"));
              },
            };
          });
          window.onNavigate(ROUTES_PATH["Bills"]);
          await new Promise(process.nextTick);
          const message = screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        });

        test("fetches messages from an API and fails with 500 message error", async () => {
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list: () => {
                return Promise.reject(new Error("Erreur 500"));
              },
            };
          });

          window.onNavigate(ROUTES_PATH["Bills"]);
          await new Promise(process.nextTick);
          const message = screen.getByText(/Erreur 500/);
          expect(message).toBeTruthy();
				});
	});
})
			})