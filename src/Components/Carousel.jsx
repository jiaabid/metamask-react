import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "./PCard";
import Sdata from "./Sdata"

function Carousal(){
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 646, min: 0 },
          items: 1
        }
      }
    return(
        <>
        <Carousel responsive={responsive}>
        {Sdata.map(val => {
            return (
                <div>
              <Card
                key={val.id}
                imgsrc={val.imgsrc}
                title={val.title}
                sname={val.sname}
                date={val.date}
                price={val.price}
              />
              </div>
            )
          })
          } 
  
  
  </Carousel>


        </>
    )
}
export default Carousal;



