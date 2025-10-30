import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */const l="http://37.157.198.11:9000/api/v0";async function v(a){const[r,n,i]=a.split("-").map(Number),o=`${l}/en/calendars/default/${r}/${n}/${i}`,s=await fetch(o);if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);return await s.json()}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("date-input"),r=document.getElementById("fetch-btn"),n=document.getElementById("calendar-info"),i=new Date().toISOString().split("T")[0];a.value=i;function o(e){if(!e||!e.celebrations||e.celebrations.length===0){n.innerHTML='<div class="error">Информация о праздниках на этот день отсутствует.</div>';return}let t=`
            <div class="day-info">
                <div class="date">${e.date}</div>
                <div class="season">${s(e.season)} (Неделя ${e.season_week})</div>
                <div class="celebrations">
        `;e.celebrations.forEach(c=>{const d=`color-${c.colour}`;t+=`
                <div class="celebration-item ${d}">
                    <div class="celebration-title">${c.title}</div>
                    <div class="celebration-rank">${c.rank}</div>
                </div>
            `}),t+=`
                </div> <!-- .celebrations -->
            </div> <!-- .day-info -->
        `,n.innerHTML=t}function s(e){return{advent:"Адвент",christmas:"Рождество",lent:"Великий пост",easter:"Пасха",ordinary:"Обычное время"}[e]||e}r.addEventListener("click",async()=>{const e=a.value;if(!e){n.innerHTML='<div class="error">Выберите дату.</div>';return}try{n.innerHTML="<div>Загрузка...</div>";const t=await v(e);o(t)}catch(t){n.innerHTML=`<div class="error">Ошибка: ${t.message||"Не удалось загрузить данные"}</div>`}}),r.click()});
