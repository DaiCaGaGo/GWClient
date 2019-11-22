# GwClient
- NodeJs: 10.15.3
- npm: 6.4.1
- Angular CLI: 7.3.7|7.3.9|8.3.3
- Angular: 7.2.0|7.2.15|8.3.3
- TypeScript: 3.4.5
- rxjs: 6.3.3|6.5.2
- Gentelella: 1.4.0
- Bootstrap: 3.3.7
- jQuery: 2.2.4
- ngx-translate/core: 11.0.1
- ngx-translate/http-loader: 4.0.0
- ngx-bootstrap: 4.1.1
- angularx-social-login: 1.2.6|1.2.7
- angular2-multiselect-dropdown: 4.2.2
- alertifyjs: 1.11.2
- file-saver: 2.0.2

## Note project
0. Update library project Angular:
	- Update Angular: 	 ng update @angular/cli @angular/core
	- Update TypeScript: npm i typescript@3.4.5 --save-dev --save-exact
1. Install NodeJS: https://nodejs.org/en/	
2. Install module in project:
	- npm install
	- npm install -g @angular/cli@latest
	- npm update --all=true		// Update all package in project
3. Create project:
	- ng new demo-angular		        // Tạo mới project
	- ng g interface <interface-name>	// Tạo mới interface
4. Run project:
    - Set-ExecutionPolicy Unrestricted
	- ng serve					// Run project port default: http://localhost:4200
	- ng serve --port 8020		// Run project với port 8020: http://localhost:8020
	- ng serve --host 0.0.0.0	// Debug project other device
	- ng serve --ssl			// Run project to HTTPS
5. Process run application: 
	- main.ts -> app.module.ts -> app.component.ts -> index.html -> app.component.html
6. Create new Component:
	- ng generate component <component-name> --dry--run	// Kiểm tra trước những thay đổi nếu tạo mới
	- ng g component <component-name>
7. Install Bootstrap, jQuery
	- npm install bootstrap@3	// Install bootstrap by version
	- npm install jquery
8. Custom view (custom directive)
	- ng g directive <directive-name>
9. Pipe {{ data | pipe }}
	- lowercase	    Chuyển chuỗi thành kí tự thường
	- uppercase	    Chuyển chuỗi thành kí tự hoa
	- date		    Chuyển dữ liệu thành định dạng ngày tháng
	- currency	    Chuyển dữ liệu thành định dạng tiền tệ
	- json		    Chuyển dữ liệu về dạng JSON
	- percent		Chuyển dữ liệu về dạng %
	- decimal		Chuyển dữ liệu về dạng thập phân
	- slice		    Cắt dữ liệu của mảng. Giống như Array.prototype.slice()
10. Service
	- ng g service <service-name>
11. Format CSS: CSS Formater
12. Debug: thêm "debugger" vào đoạn code muốn debug
13. Font: npm install font-awesome@4.7.0
14. Skin: 
	- npm i admin-lte
	- npm i gentelella
15. Git: 
	- git status                    // Xem trạng thái hiện tại của project trên Git
	- git remote add origin <url>   // Add project vào url trên Git
	- git remote show origin        // Xem url hiện tại của project trên Git
	- git commit -am "input message"     // Commit với nội dung message
	- git pull origin master
	- git push origin master
	- Start -> Run rundll32.exe keymgr.dll,KRShowKeyMgr		// Delete user saved
16. Deploy IIS:
<code>
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
    <system.web>
        <compilation targetFramework="4.0" />
        <customErrors mode="On" redirectMode="ResponseRewrite">
        <error statusCode="404" redirect="/index.html" />
        </customErrors>
    </system.web>
    <system.webServer>
        <httpErrors errorMode="Custom">
        <remove statusCode="404"/>
        <error statusCode="404" path="/index.html" responseMode="ExecuteURL"/>
        </httpErrors>
    </system.webServer>
    </configuration>	
</code>	
17. Translate
	- npm install @ngx-translate/core @ngx-translate/http-loader --save
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

-- ng build --aot=false // Build project ignore error
-- ng build --prod 		// Release product

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
