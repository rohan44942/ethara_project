import { motion } from 'framer-motion';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  hover = false,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden
        ${hover ? 'hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      
      <div className="p-6">{children}</div>
    </motion.div>
  );
};

export default Card;
