import React, { useEffect, useState } from 'react';
import { getSelectionName } from '../../../Helpers/cart';
import { CartItem, Order } from '../../../Interfaces/interfaces';
import pullsImg from '../../../Assets/icons/pulls.svg';

export default function PendingOrderPulls({
  allOrders
}:{
  allOrders: Order[]
}){
  const [isPendingPullsViewExpanded,setIsPendingPullsViewExpanded] = useState<boolean>(false);
  const [currentPulls, setCurrentPulls] = useState<CartItem[]>([]);
  const [allPendingOrders, setAllPendingOrders] = useState<Order[]>([]);
  
  useEffect(()=>{
    //set pending orders state
    const allPendingOrders:Order[] = allOrders.filter((order:Order)=>{
      if (order.status==='Pending') return 1;
      return 0;
    });
    setAllPendingOrders(allPendingOrders);
  },[allOrders]);

  //update pulls when all pending orders are retrieved
  useEffect(()=>{
    const pullsData:CartItem[] = [];
    allPendingOrders.forEach((pendingOrder:Order)=>{
      pendingOrder.cart.items.forEach((item:CartItem)=>{
        //find if item exists already in the pulls data array
        let foundItemIndex:number | null = null;

        pullsData.map((pullsData:CartItem,index:number)=>{
          //condition item is already in the pulls data array
          if (
            item.itemData.name===pullsData.itemData.name &&// item name matches
            item.selection === pullsData.selection && //item selection matches
            item.itemData.cat === pullsData.itemData.cat //category matches
          ){
            foundItemIndex=index;
          };
        });

        if (foundItemIndex){
          pullsData[foundItemIndex].quantity += item.quantity;
        }else{
          pullsData.push(item);
        };
      });
    });
    setCurrentPulls(pullsData);
  },[allPendingOrders])
  
  if (isPendingPullsViewExpanded){
    return(
      <section className='pending-orders-panel-wrapper'>
        <h3 onClick={()=>{setIsPendingPullsViewExpanded(false)}}>
          <img src={pullsImg} alt='pulls' />
          <span>Pending Orders Pulls</span>
        </h3>
        <ul className='pending-orders-panel-content'>
          {
            currentPulls
            ? 
              currentPulls.map((currentPull:CartItem,index:number)=>{
                return(
                  <li key={index}>
                    <p>{currentPull.itemData.name}</p>
                    <p>{currentPull.quantity + ' '+getSelectionName(currentPull)}</p>
                    <input type='checkbox' />
                  </li>
                )
              })
            :
              null
          }
        </ul>
      </section>
    );
  }else{
    return(
      <section>
        <h3 onClick={()=>{setIsPendingPullsViewExpanded(true)}}>
          <img src={pullsImg} alt='pulls' />
          <span>Pending Orders Pulls</span>
        </h3>
      </section>
    );
  };
};