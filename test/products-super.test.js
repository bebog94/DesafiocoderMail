import supertest from "supertest";
import { expect } from "chai";
import mongoose from 'mongoose';
import { faker } from "@faker-js/faker";
const requester = supertest("http://localhost:8080")



const generateRandomUser = (role) => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 60 }),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role
    };
};
const generateRandomProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.urlLoremFlickr({ category: 'fashion' }),
        code: faker.string.alphanumeric(5),
        stock: faker.number.int(100),
    }
};

describe("Test Products Router", function() {
    const roleUser = generateRandomUser("USER");
    const rolePremium = generateRandomUser("PREMIUM");
    const rolePremium2 = generateRandomUser("PREMIUM");
    const roleAdmin = generateRandomUser("ADMIN");
    const userLogin = {
        email: roleUser.email,
        password: roleUser.password
    };
    const premiumLogin = {
        email: rolePremium.email,
        password: rolePremium.password
    };
    const premium2Login = {
        email: rolePremium2.email,
        password: rolePremium2.password
    };
    const adminLogin = {
        email: roleAdmin.email,
        password: roleAdmin.password
    };

    const productByUser = generateRandomProduct();
    const productByPremium = generateRandomProduct();

    let cookie; 
    let responseCreatedP
    let premium1signedup
    let premium2signedup
    let adminSignedUp

    before(async function () {
        await mongoose.connect('mongodb+srv://bebogaravano:b.3823584568@cluster0.gcmvsft.mongodb.net/testingDesafio?retryWrites=true&w=majority')             
        await mongoose.connection.collection('users').deleteOne({email: roleUser.email})
        await mongoose.connection.collection('users').deleteOne({email: rolePremium.email})
        await mongoose.connection.collection('products').deleteOne({code: productByUser.code})
        await mongoose.connection.collection('products').deleteOne({code: productByPremium.code})            
    }) 

    describe("POST, '/api/products'", ()=> {  
 
          
        it('should create a product', async ()=>{
            premium1signedup = await requester.post('/api/sessions/signup').send(rolePremium)                 
            const login = await requester.post('/api/sessions/login').send(premiumLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }            
            responseCreatedP = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(productByPremium) 
            expect(responseCreatedP.statusCode).to.be.equal(200)
            expect(responseCreatedP._body.response).to.have.property('owner');
            
            
        })  

        it('should not create a product because its role user', async ()=>{
            await requester.post('/api/sessions/signup').send(roleUser)        
            const login = await requester.post('/api/sessions/login').send(userLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }            
            const responseUserP = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(productByUser)         
            expect(responseUserP.statusCode).to.be.equal(403)
        })
        
    })


    describe("GET, '/api/products'", ()=> {          
        it('should get all products', async ()=>{                         
            const response = await requester.get('/api/products')
            expect(response._body.products).to.include.keys('page','payload','limit')
            expect(response._body.products.payload).to.be.an('array') 
            expect(response._body.products).to.have.property('limit')
            expect(response._body.products).to.have.property('totalPages')
            expect(response.statusCode).to.be.equal(200)
        })
        it('should show the accurate number of products defined by the limit query', async ()=>{ 
            const numLimit = 10                        
            const response = await requester
                .get('/api/products')
                .query({limit: numLimit, page: 2}) 
            expect(response._body.products.payload).to.have.lengthOf(numLimit)
        })        
    })


    describe("GET, '/api/products/:id'", ()=> {          
        it('should get the selected product', async ()=>{  
            const productId = responseCreatedP._body.response._id                        
            const response = await requester.get('/api/products/' + productId)       
            expect(response._body.product).to.be.an('object') 
            expect(response.statusCode).to.be.equal(200)
            expect(response._body.product).to.have.property('owner')
        })               
    })


    describe("PUT, '/api/products/:id'", ()=> {
        const updateObject = {
            title: 'My updated Product',
            description: 'Totally updated',    
            price: '666',     
            thumbnail: 'www.theupdateishere.com',
            code: 'abc11',
            stock: 5,
            category: 'dresses'
        }
        
        
        it('should update a product', async ()=>{
            adminSignedUp = await requester.post('/api/sessions/signup').send(roleAdmin)                 
            const login = await requester.post('/api/sessions/login').send(adminLogin)   
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.response._id                        
            const updated = await requester
                .put('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(updateObject)                 
            expect(updated.statusCode).to.be.equal(200)         
        })  
/* 
        it('should not update a product because its role user', async ()=>{
           
            await requester.post('/api/sessions/signup').send(roleUser)                
            const login = await requester.post('/api/sessions/login').send(userLogin)   
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.response._id;                      
            const updated = await requester
                .put('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(updateObject)                
            expect(updated.statusCode).to.be.equal(403)            
        })     */         
    })



    describe("DELETE, '/api/products/:id'", ()=> {
        const anotherCreatedP = {
            title: 'another Created Product',
            description: 'Product to be deleted by Owner',    
            price: '2',     
            thumbnail: 'www.thefirst.com',
            code: 'abc25000',
            stock: 5,
            category: 'dresses'
        }
        
        it('a premium user should delete a product that he/she owns', async ()=>{            
            const login = await requester.post('/api/sessions/login').send(premiumLogin)
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productByPremium = await requester 
                .post('/api/products') 
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(anotherCreatedP)
            const productId = productByPremium._body.response._id                        
            const deleted = await requester
                .delete('/api/products/' + productId) 
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])                         
            
            expect(deleted.statusCode).to.be.equal(200) 
            expect(deleted._body.message).to.be.equal('Product deleted')
            
            const searchProduct = await requester.get('/api/products/' + productId)         
            expect(searchProduct.statusCode).to.be.equal(404) 
        })  

        it('a premium user should not delete a product that he/she doesnt own', async ()=>{
            premium2signedup = await requester.post('/api/sessions/signup').send(rolePremium2) 
            const login = await requester.post('/api/sessions/login').send(premium2Login) 
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.response._id
                  
            const deleted = await requester
                .delete('/api/products/' + productId) 
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])            
            expect(deleted.statusCode).to.be.equal(403)
        })
        
        it('an admin user should delete any product', async ()=>{   
            const login = await requester.post('/api/sessions/login').send(adminLogin) 
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.response._id            
            const deleted = await requester
                .delete('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])                         
            expect(deleted.statusCode).to.be.equal(200)
            
            const searchProduct = await requester.get('/api/products/' + productId)         
            expect(searchProduct.statusCode).to.be.equal(404)         
        })
    })

})