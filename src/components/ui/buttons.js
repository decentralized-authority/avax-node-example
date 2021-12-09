export const Button = ({ children, onClick, buttonStyle = 'primary', type = 'button' }) => {
  return (
    <button className={`btn btn-${buttonStyle} d-block w-100 mb-0`} onClick={onClick} type={type}>{children}</button>
  );
};

export const ButtonSuccess = props => {
  return (
    <Button {...props} buttonStyle={'success'} />
  );
};

export const ButtonDanger = props => {
  return (
    <Button {...props} buttonStyle={'danger'} />
  );
};

export const ButtonInfo = props => {
  return (
    <Button {...props} buttonStyle={'info'} />
  );
};
