import { productsService } from "../repository/index.js";

export const avoidDeletion = () => {
    return async (req, res, next) => {      
        try {      
            const { pid } = req.params;
            const product = await productsService.findById(pid);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (req.user && req.user.role === 'PREMIUM' && product.owner != req.user._id) {
                return res.status(403).json({ message: 'You can\'t delete a product that you don\'t own' });
            }                        
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};