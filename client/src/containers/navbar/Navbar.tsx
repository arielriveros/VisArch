import Button from '../../components/button/Button'
import './Navbar.css'

function Navbar() {

    const dummy = () => {
        console.log("dummy");
    }

    return (
        <div className="navbar">
            <div className="logo">
                <h1>VisArch</h1>
            </div>
            <div className="navigation">
                <Button text='Section 1' onClick={dummy}/>
                <Button text='Section 2' onClick={dummy}/>
                <Button text='Section 3' onClick={dummy}/>
            </div>
        </div>
    )
}

export default Navbar