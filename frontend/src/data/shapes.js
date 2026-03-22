export const SHAPES = [];

const getColor = (diff) => diff === 'Easy' ? 'var(--success)' : (diff === 'Medium' ? '#f59e0b' : 'var(--accent)');

// 1. Regular/Basic Shapes (4)
SHAPES.push({ name: 'Circle', diff: 'Easy', color: getColor('Easy'), draw: (ctx, w, h) => { ctx.arc(w/2, h/2, 120, 0, 2*Math.PI); } });
SHAPES.push({ name: 'Square', diff: 'Easy', color: getColor('Easy'), draw: (ctx, w, h) => { ctx.rect(w/2 - 120, h/2 - 120, 240, 240); } });
SHAPES.push({ name: 'Triangle', diff: 'Easy', color: getColor('Easy'), draw: (ctx, w, h) => { ctx.moveTo(w/2, h/2 - 130); ctx.lineTo(w/2 + 130, h/2 + 100); ctx.lineTo(w/2 - 130, h/2 + 100); ctx.closePath(); } });
SHAPES.push({ name: 'Cross', diff: 'Easy', color: getColor('Easy'), draw: (ctx, w, h) => { 
    const cx=w/2, cy=h/2, r=120, w1=40; 
    ctx.rect(cx-w1, cy-r, w1*2, r*2); 
    ctx.rect(cx-r, cy-w1, r*2, w1*2); 
}});

// 2. Polygons (20 shapes)
for(let i=5; i<=24; i++) {
    const diff = i <= 8 ? 'Easy' : (i <= 14 ? 'Medium' : 'Hard');
    SHAPES.push({
        name: `${i}-gon`, diff, color: getColor(diff),
        draw: (ctx, w, h) => {
            const cx = w/2, cy = h/2, r = 130;
            ctx.moveTo(cx + r, cy);
            for(let j=1; j<=i; j++) {
                ctx.lineTo(cx + r*Math.cos(j*2*Math.PI/i), cy + r*Math.sin(j*2*Math.PI/i));
            }
            ctx.closePath();
        }
    });
}

// 3. Stars (20 shapes)
for(let i=4; i<=23; i++) {
    const diff = i <= 6 ? 'Medium' : 'Hard';
    SHAPES.push({
        name: `${i}-Point Star`, diff, color: getColor(diff),
        draw: (ctx, w, h) => {
            const cx = w/2, cy = h/2, r1 = 130, r2 = 60;
            const step = Math.PI / i;
            let rot = Math.PI / 2 * 3;
            ctx.moveTo(cx, cy - r1);
            for(let j=0; j<=i*2; j++) {
                const r = j % 2 === 0 ? r1 : r2;
                ctx.lineTo(cx + Math.cos(rot)*r, cy + Math.sin(rot)*r); rot += step;
            }
            ctx.closePath();
        }
    });
}

// 4. Flowers (Rose Curves) (20 shapes)
for(let i=3; i<=22; i++) {
    const diff = i <= 8 ? 'Medium' : 'Hard';
    SHAPES.push({
        name: `${i}-Petal Flower`, diff, color: getColor(diff),
        draw: (ctx, w, h) => {
            const cx = w/2, cy = h/2;
            for(let a=0; a<=Math.PI*2.05; a+=0.05) {
                const r = 130 * Math.abs(Math.cos(i * a * 0.5));
                const x = cx + r * Math.cos(a);
                const y = cy + r * Math.sin(a);
                if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
    });
}

// 5. Lissajous curves (20 shapes)
for(let i=1; i<=20; i++) {
    const aParams = [1,2,3,4,5];
    const bParams = [2,3,4,5,6];
    const a = aParams[i % 5];
    const b = bParams[(i * 3) % 5] + (a === bParams[(i * 3) % 5] ? 1 : 0); // avoid circle
    const diff = 'Hard';
    SHAPES.push({
        name: `Lissajous ${a}:${b}`, diff, color: getColor(diff),
        draw: (ctx, w, h) => {
            const cx = w/2, cy = h/2;
            for(let t=0; t<=Math.PI*2.05; t+=Math.PI/100) {
                const x = cx + 130 * Math.sin(a * t);
                const y = cy + 130 * Math.sin(b * t);
                if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
    });
}

// 6. Superellipses (16 shapes)
for(let i=1; i<=16; i++) {
    const n = 0.5 + i*0.2; 
    const diff = n < 1 ? 'Medium' : 'Hard';
    SHAPES.push({
        name: `Superellipse Core ${i}`, diff, color: getColor(diff),
        draw: (ctx, w, h) => {
            const cx = w/2, cy = h/2, a = 130, b = 130;
            for(let t=0; t<=Math.PI*2.05; t+=0.05) {
                const cost = Math.cos(t);
                const sint = Math.sin(t);
                const x = cx + a * Math.pow(Math.abs(cost), 2/n) * Math.sign(cost);
                const y = cy + b * Math.pow(Math.abs(sint), 2/n) * Math.sign(sint);
                if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
    });
}
