import { productsService } from "../repository/index.js";


export const avoidAddToCart = () => {
  return async (req, res, next) => {      
      const { pid } = req.params;
      
      try {
          const product = await productsService.findById(pid);

          if (!product) {
              return res.status(404).json({ message: 'Product not found' });
          }

          if (req.user && req.user.role === 'PREMIUM' && product.owner.toString() === req.user._id) {
              return res.json({ message: 'You can\'t buy this product as you own it' });
          }            

          next();
      } catch (error) {
          return res.status(500).json({ message: 'Internal Server Error' });
      }
    };
}