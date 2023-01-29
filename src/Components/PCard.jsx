import React from "react";

function Card(prop) {
    return (
        <>
            <div className='card'>
                <img className='cardImg' alt='pic'
                    src={prop.imgsrc}
                />
                <div className='cardInfo'>
                    <h4>{prop.title}</h4>
                    <p>Pre-sale: {prop.date}</p>



                    <div className="d-flex justify-content-between">
                        <div>
                            <span>Mint Price:</span>
                            <h6>{prop.price}</h6>
                        </div>
                        <div>
                            <button className="btn btn-color">Mint</button>
                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}
export default Card;