import PropTypes from 'prop-types';

export default function Avatar({ src, alt, name, onClick }) {
  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onClick}>
      <div className="relative w-10 h-10 transition-transform duration-200 ease-in-out transform hover:scale-110">
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

// Xác thực thuộc tính
Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};