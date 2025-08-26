import Select from 'react-select';
import Text from '../text/text';

const SelectField = ({
  name,
  value,
  handleChange,
  placeholder,
  required,
  options,
  defaultValue,
  width,
  showLabelWithValue = false,
  topPlaceholder = false,
  textAlign = 'center',
  textColor = 'black',
}) => {
  const customStyles = {
    container: provided => ({
      ...provided,
      width: width,
    }),
    control: (provided, state) => ({
      ...provided,
      outline: 'none',
      cursor: 'pointer',
      height: '40px',
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? 'var(--foreground)' : 'var(--foreground)',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': { borderColor: 'var(--foreground)' },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'var(--font-inter)',
      color: state.isFocused || state.isSelected ? 'white' : textColor,
      textAlign: textAlign,
    }),
    input: provided => ({
      ...provided,
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'var(--font-inter)',
      color: textColor,
      textAlign: textAlign,
    }),
    placeholder: provided => ({
      ...provided,
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'var(--font-inter)',
      color: textColor,
      textAlign: textAlign,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'var(--font-inter)',
      color: state.isFocused || state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected
        ? 'var(--accent2-hover)'
        : state.isFocused
          ? 'var(--accent2-hover)'
          : 'white',
      cursor: 'pointer',
    }),
  };

  const valueId = `select-${name}`;
  const dynamicValue = textAlign === 'center' ? 'center' : 'flex-start';

  return (
    <label className="relative w-full flex flex-col items-center gap-[0px]">
      {topPlaceholder && (
        <div
          className="absolute top-[-23px] left-0 w-full flex items-center"
          style={{ justifyContent: dynamicValue }}
        >
          <Text
            type="tiny"
            as="p"
            fontWeight="light"
            className={topPlaceholder ? 'text-white' : 'text-black'}
          >
            {placeholder}
          </Text>
        </div>
      )}
      <Select
        id={valueId}
        instanceId={valueId}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        options={options}
        styles={customStyles}
        defaultValue={defaultValue}
        maxMenuHeight={152}
        formatOptionLabel={option =>
          showLabelWithValue
            ? `${option.value} - ${option.label}`
            : option.label
        }
        theme={theme => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: 'var(--foreground)',
          },
        })}
      />
    </label>
  );
};

export default SelectField;
