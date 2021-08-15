const storeForm=document.getElementById('store-form')
const storeId=document.getElementById('store-id')
const storeAddress=document.getElementById('store-address')

async function addStore(e){
    e.preventDefault();

    if(storeId.value==='' || storeAddress.value===''){
        alert('Please fill in feilds')
    }
    const sendBody = {
        storeId:storeId.value,
        address:storeAddress.value
    }

    try{
        const res = await fetch('/api/v1/stores',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(sendBody)
        })
        if(res.status==400){
            throw Error('store already exist')
        }
        alert('store added!')
        window.location.href='/camplocation'
    } catch(err){
        alert(err);
    }
}

storeForm.addEventListener('submit',addStore)