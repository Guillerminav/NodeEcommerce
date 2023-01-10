import bcrypt from 'bcryptjs'

const data = {
    users: [
        {
            name: 'Guillermina',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: 'Tomas',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false
        }
    ],
    products: [
        {
            _id: '1',
            name: 'Empanadas de soja texturizada y lentejas',
            slug: 'empanadas-de-soja-texturizada-y-lentejas',
            category: 'Empanadas',
            image: '/images/p2.png',
            price: 120,
            countInStock: 100,
            rating: 4.5,
            numReviews: 10,
            description: 'Empanadas de soja texturizada y lentejas. 100% vegetal, orgánico, no transgénico y sin conservantes.'
        },
        {
            _id: '2',
            name: 'Hamburguesa de lentejas',
            slug: 'hamburguesa',
            category: 'Hamburguesas',
            image: '/images/p1.png',
            price: 200,
            countInStock: 100,
            rating: 4.5,
            numReviews: 10,
            description: 'Hamburguesa de lentejas con pan de remolacha. 100% vegetal, orgánico, no transgénico y sin conservantes.'
        },
        {
            _id: '3',
            name: 'Tarta de cebolla y paparella',
            slug: 'tarta-de-cebolla-y-paparella',
            category: 'Tartas',
            image: '/images/p2.png',
            price: 100,
            countInStock: 100,
            rating: 3.5,
            numReviews: 10,
            description: 'Tarta de cebolla y paparella. 100% vegetal, orgánico, no transgénico y sin conservantes.'
        },
        {
            _id: '4',
            name: 'Empanadas de paparella, tomate y ajo',
            slug: 'empanadas-de-paparella-tomate-y-ajo',
            category: 'Empanadas',
            image: '/images/p1.png',
            price: 120,
            countInStock: 100,
            rating: 2,
            numReviews: 10,
            description: 'Empanadas de soja texturizada y lentejas. 100% vegetal, orgánico, no transgénico y sin conservantes.'
        },
        {
            _id: '5',
            name: 'Empanadas de no-atún',
            slug: 'empanadas-de-no-atun',
            category: 'Empanadas',
            image: '/images/p2.png',
            price: 120,
            countInStock: 0,
            rating: 1,
            numReviews: 5,
            description: 'Empanadas de soja texturizada y lentejas. 100% vegetal, orgánico, no transgénico y sin conservantes.'
        }
    ]
}

export default data