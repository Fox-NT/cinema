import Swal from 'sweetalert2';
const api = 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2021-04-01&primary_release_date.lte=2022-06-06&api_key=21c3b467fac244b77912c5844be89740&language=ru-RU&&region=RU&page=1'
const path = 'https://image.tmdb.org/t/p/w1280'
const searchAPI = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'
const list = document.querySelector('.movie-list');
const cinema = document.querySelector('.cinema');

const namef = document.querySelector('.name');
const seats = document.querySelector('.seats');
const seatFree = document.querySelectorAll('.row .seat:not(.seat-occupied)');
const total = document.querySelector('.total-price');
const movieSelect = document.querySelector('#films');
const selet = document.querySelector('.sel-seat');


const getFilms = async url => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, error code: ${res.status}`);
    }
    return await res.json();
};

getFilms(api).then(data => {
    console.log(data.results);
    data.results.forEach(({ title, poster_path, release_date }) => {
        new ItemFilm(title, poster_path, release_date).push();
    });
});

function createFilms(img, name, alt, date) {
    const newFilm = document.createElement('div');
    newFilm.classList.add('movie');
    newFilm.setAttribute('data-name', name)
    newFilm.innerHTML = `<img src='${path}${img}' alt="${name}">
                        <div class="ticket">
                            <div class="ticket-name">${name}</div>
                            <div class="ticket-date">
                            Дата выхода: ${date}
                            </div>
                            <div class="ticket-buy">
                                <a class="link" href="#">Купить билет</a>
                            </div>
                        </div>`;
    list.append(newFilm);
    newFilm.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('link')) {
            const label = e.currentTarget.getAttribute('data-name');
            list.style.display = 'none';
            cinema.style.display = 'flex';
            namef.innerHTML = `${label}`;
        }
    })
}
class ItemFilm {
    constructor(title, img, date) {
        this.img = img;
        this.name = title;
        this.alt = title;
        this.date = date;
    }
    push() {
        createFilms(
            this.img,
            this.name,
            this.alt,
            this.date
        );
    }
}

// function createFilms(films) {
//     films.forEach(film => {
//         console.log(film);
//         const el = document.createElement('div');
//         el.classList.add('movie')
//         el.innerHTML = `<img src='${path}${film.poster_path}' alt="${film.title}">
//                         <div class="ticket">
//                             <div class="ticket-name">${film.title}</div>
//                             <div class="ticket-date">
//                             Дата выхода: ${film.release_date}
//                             </div>
//                             <div class="ticket-buy">
//                                 <a href="#">Купить билет</a>
//                             </div>
//                         </div>`
//         list.append(el);
//         el.addEventListener('click', (e) => {
//             e.preventDefault();
//                 list.style.display = 'none';
//                 cinema.style.display = 'flex';
//         })
//     })
// }


let price = 130;
let count = 0;

const random1 = Math.floor(Math.random()*seatFree.length);

let i;
for (i=0; i <= random1; i++) {
    const random2 = Math.floor(Math.random()*seatFree.length);
    seatFree[random2].classList.add('seat-busy')
}

seats.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('seat-busy') && !e.target.classList.contains('seat-selected')) {
        e.target.classList.add('seat-selected');
        count++;
        const seat = e.target.getAttribute('data-seat');
        const row = e.target.getAttribute('data-row');
        const info = document.createElement('div');
        info.innerHTML = `${row} ряд - ${seat} место.`;
        info.setAttribute('data-row', row);
        info.setAttribute('data-seat', seat);
        selet.append(info);
        total.innerHTML = `${count*price}`

    } else if (e.target.classList.contains('seat-selected')) {
        e.target.classList.remove('seat-selected');
        const s = selet.querySelectorAll('div');
        s.forEach(i => {
            if (i.getAttribute('data-seat') === e.target.getAttribute('data-seat') && i.getAttribute('data-row') === e.target.getAttribute('data-row')) {
                i.innerHTML = '';
            }
        })
        count--;
        total.innerHTML = `${count*price}`;
    } else if (e.target.classList.contains('seat-busy')) {
        alert('Занято!')
    }
});

// function updateSelectedCount() {
//     const selectedSeats = document.querySelectorAll('.row .seat-selected');
//
//     const seatsIndex = [...selectedSeats].map(seat => seat.getAttribute('data-seat'));
//     // selectedSeats.forEach(seat => {
//     const seatsRow = [...selectedSeats].map(seat => seat.getAttribute('data-row'))
//         console.log(seatsRow[i]);
//     console.log(seatsIndex[i]);
//
//     const info = document.createElement('div');
//     info.innerHTML = `${seatsRow} ряд - ${seatsIndex} место.`;
//     selet.append(info);
//     // console.log(selectedSeats.(seat => seat.getAttribute('data-row')))
//     localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
//
//     const selectedSeatsCount = selectedSeats.length;
//
//     let count = selectedSeatsCount;
//     let total = selectedSeatsCount * 120;
//     // console.log(count)
//     // console.log(total)
// }

function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seatFree.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('seat-selected');
            }
        });
    }
}

const pay = document.querySelector('.pay');
pay.addEventListener('click', (e) => {
    e.preventDefault();
    if(count === 0) {
        Swal.fire(
            'Ошибка!',
            'Вы не выбрали ни одного места. Попробуйте еще раз',
            'error'
        )
        return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
        title: 'Оплата',
        text: `Сумма к оплате ${count*price} руб. Кол-во билетов: ${count} шт.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Да, оплатить!',
        cancelButtonText: 'Нет, передумал!',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Оплата!',
                'Оплата прошла успешно.',
                'success'
            )
            const a = document.querySelectorAll('.seat-selected');
            a.forEach(i => {
                i.classList.add('seat-busy');
                i.classList.remove('seat-selected');
            });
            document.querySelector('.sel-seat').innerHTML = '';
            count = 0;
            total.innerHTML = '0';
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Оплата',
                'Вы отменили попытку оплаты :(',
                'error'
            )
        }
    })

})

// movieSelect.addEventListener('change', (e) => {
//     price = +e.target.value;
//     console.log(price);
//     const a = document.querySelectorAll('.seat-selected');
//     const b = document.querySelectorAll('.seat-busy');
//     a.forEach(i => {
//         i.classList.remove('seat-busy');
//     });
//     b.forEach(i => {
//         i.classList.remove('seat-selected');
//     });
//     document.querySelector('.sel-seat').innerHTML = '';
//     count = 0;
//     total.innerHTML = '0';
// });
