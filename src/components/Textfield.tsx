export default function Textfield({buttonText, placeholder, func}: {buttonText: string, placeholder: string, func: (formData: FormData) => Promise<JSX.Element>}) {
  return (
    <form action={func} className='textfield'>
      <input type="text" name="result" placeholder={placeholder}/>
      <button type="submit" className="combinedInput">{buttonText}</button>
    </form>
  )
}