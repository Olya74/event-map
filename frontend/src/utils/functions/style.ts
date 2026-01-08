

// Style function for active links
const navLinkStyles = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? '#007bff' : '#333',
  textDecoration: isActive ? 'none' : 'underline',
  fontWeight: isActive ? 'bold' : 'normal',
  padding: '5px 10px'
});

export { navLinkStyles };