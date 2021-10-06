const stages_smoke = [
    { duration: '1m', target: 1 }
];

const stages_load = [
    { duration: '2m', target: 30 }, // simulate ramp-up of traffic from 1 to 30 users over 2 minutes.
    { duration: '2m', target: 30 }, // stay at 30 users for 3 minutes
    { duration: '2m', target: 0 }, // ramp-down to 0 users
];

const stages_stress = [
    { duration: '2m', target: 50 }, // below normal load
    { duration: '5m', target: 50 },
    { duration: '2m', target: 120 }, // normal load
    { duration: '5m', target: 120 },
    { duration: '2m', target: 200 }, // beyond the breaking point
    { duration: '5m', target: 200 },
    { duration: '5m', target: 0 }, // scale down. Recovery stage.
];

const stages_soak = [
    { duration: '2m', target: 30 }, // ramp up to 400 users
    { duration: '3h56m', target: 30 }, // stay at 400 for ~4 hours
    { duration: '2m', target: 0 }, // scale down. (optional)
];
export const config = {
    base_url: "http://localhost:5000",
    smoke: {
        stages: stages_smoke
    },
    load: {
        stages: stages_load
    },
    stress: {
        stages: stages_stress
    },
    soak: {
        stages: stages_soak
    }
};