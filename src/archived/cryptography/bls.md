---
title: BLS12-381
description: Learn about the pairing-based curve BLS12-381 and its use in securing Dusk.
---

This is a non-exhaustive introduction to some of the key characteristics of the elliptic curve BLS12-381.
For further reading have a look at <a href="https://hackmd.io/@benjaminion/bls12-381" target="_blank">BLS12-381-For The Rest Of Us</a> or the <a href="https://electriccoin.co/blog/new-snark-curve" target="_blank">announcement</a>.

## Origin

BLS12-381 was proposed by Sean Bowe in 2017 and is part of a group of elliptic curves described by **B**arreto, **L**ynn and **S**cott (hence BLS) back in 2002.

The curve is defined by the equation:

$$
y^2 = x^3 + 4
$$

The points on the curve are pairs $(x,y)$ that solve the curve equation plus an artificial *point at infinity*, called $o$, that has no affine coordinates and serves as the neutral element in point addition. [^1]

For example: The point $(0, 2)$ is on the curve and by definition: $(0, 2) + o = (0, 2)$.

## Curve Definition

Other than our curves from back in school, which commonly had coordinates in the real numbers $\mathbb{R}$, elliptic curves have coordinates in a finite field $\mathbb{F}_q$ and $q$ in the case of BLS12-381 is the prime number 

$$
\begin{aligned}
q=&4002409555221667393417789825735904156556882819939007885332058136124031650490 \\
&837864442687629129015664037894272559787 \\
&
\end{aligned}
$$
which is in hexadecimal is
$$
\begin{aligned}
q=0x&1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb1 \\
&53ffffb9feffffffffaaab
\end{aligned}
$$

This prime number is exactly 381 bits long (hence 381).

The field $\mathbb{F}_q$ can be thought of as the natural numbers modulo $q$.
These are the integers from $0$ to $q-1$ and when you hit $q$ you simply start at $0$ again.

So $q$ becomes $0$, and $q+1$ becomes $1$, and $q+2$ becomes $2$ and so on.

At this point we have an elliptic curve (let's call it $E$) and this curve consists of points with coordinates $x,y\in\mathbb{F}_q$ where $x$ and $y$ satisfy the following equation plus $o$ the artificial point at infinity.

$$
E(\mathbb{F}_q): y^2 = x^3 + 4
$$

We call this the *group of $\mathbb{F}_q$-rational points* of $E$. [^2]

## Subgroup of Elliptic Curve Points

The group of $\mathbb{F}_q$-rational points of $E$ is rather large and we are actually only interested in a subgroup of it.
This subgroup (we call it $\mathbb{G}$) is cyclic under addition, which means that there is a point $G\in\mathbb{G}$, called the *generator of* $\mathbb{G}$, that reaches all the other point in $\mathbb{G}$ when being added to itself.

So with the point $G\in\mathbb{G}$, we can construct the whole group:

$$
\mathbb{G}=\{o, G, 2\cdot G, 3\cdot G, ..., (r-1)\cdot G\}
$$

The number $r$ is the amount of elements in $\mathbb{G}$, also called the *order* of $\mathbb{G}$, and in the case of the BLS12-381 curve:

$$
r=52435875175126190479447740508185965837690552500527637822603658699938581184513
$$
which in hexadecimal is 
$$
r=0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001
$$

Because $r$ is a prime number it follows that all points except the point at infinity can function as the generator. [^3]

## BLS Scalar

Since every point in $\mathbb{G}$ generates all other points in $\mathbb{G}$, we can fix an arbitrary point $G\in\mathbb{G}$ [^4] and reach all other points in $\mathbb{G}$ simply by multiplying $G$ with a scalar $s$ that is smaller than $r$.
This scalar $s$ is what we call a `BlsScalar` and we often write it framed with square brackets $[s]$ [^5].

In our cryptographic scheme we often use the `BlsScalar` $s$ as a our *secret key* and the corresponding group element $s\cdot G$ as our *public key*.

## Embedding degree

The 12 in BLS12-381 refers to the embedding degree [^8]. But what exactly is the embedding degree?
To explore that we need to have a look at elliptic curve pairings.
However, since this is an introduction to the BLS12-381 curve and not to elliptic curve pairings, we won't go into too much detail here.
For further reading please check out [Pairings for Beginners](https://www.craigcostello.com.au/s/PairingsForBeginners.pdf).

So this is only a short summary on those aspects of elliptic curve pairing that help us understand the embedding degree.

### Elliptic curve pairing

A pairing is a function that takes a point from a group $\mathbb{G}_1$ and another point from a group $\mathbb{G}_2$ and maps the two points onto a third point from a group $\mathbb{G}_T$, where $\mathbb{G}_1$, $\mathbb{G}_2$ and $\mathbb{G}_T$ are all of the same order, i.e. have the same amount of elements.

$$
e: \mathbb{G}_1 \times \mathbb{G}_2 \rightarrow \mathbb{G}_T
$$

One of the most important properties of pairings is that for points $P, S \in \mathbb{G}_1$ and $R, Q \in \mathbb{G}_2$:
- $e(P,Q+R) = e(P,Q) \cdot e(P,R)$
- $e(P+S,Q) = e(P,Q) \cdot e(S,Q)$

From this we can deduce that for two integers $a,b$ and their corresponding `BlsScalar` $[a],[b]$ :

$$
\begin{aligned}
e([a]P,[b]Q) &= e(P,[b]Q)^a = e(P,Q)^{ab} = e(P,[a]Q)^b \\
&= e([b]P,[a]Q)
\end{aligned}
$$

We use this property in nearly all of our cryptographic schemes.

The groups $\mathbb{G}_1$, $\mathbb{G}_2$ and $\mathbb{G}_T$ must be of the same order.
But so far we only have one group like that: the above group $\mathbb{G}$.
Let's pick it for $\mathbb{G}_1$ [^6].

Then what about $\mathbb{G}_2$ and $\mathbb{G}_T$?

Let's start by looking at $\mathbb{G}_T$ which is defined as the *group of roots of unity of order $r$* (we will get to the meaning of that in a bit) and closely related to the embedding degree. But before we get into that, we also need to understand extension fields:

### Extension Fields

Do you remember the complex numbers $\mathbb{C}$?

For all complex numbers $x\in\mathbb{C}$ there exist two real numbers $a,b\in\mathbb{R}$ such that

$$
x = a +ib \textrm{,  with  } i^2=-1
$$

Sometimes we also write

$$
x = (a,b) \textrm{,  with  } x\in \mathbb{R}^2
$$

We say that the complex numbers are a *quadratic extension* of the real numbers and it is easy to see that the real numbers are a subset of the complex numbers (when $b=0$).

We can not extend the complex numbers any further [^7], but that is a different story for finite fields.

### Roots of Unity

Moreover, we can construct the 12th extension field $\mathbb{F}_{q^{12}}$, which is the smallest extension field of $\mathbb{F}_q$ containing a *group of $r$th roots of unity* (the group $\mathbb{G}_T$ that we need for pairing).

This group is defined as follows:

$$
\mathbb{G}_T= \{ u_0, u_1 ..., u_{r-1}\}\subset \mathbb{F}_{q^{12}} 
$$

with

$$
u_0^r=u_1^r=...=u_{r-1}^r=1
$$

To understand what that means, let's give an example.
Over the field $\mathbb{F}_{17}$ we have the group of the $4$th roots of unity $\mathbb{G}_T=\{1, 4, 16, 13\}$, since

$$
\begin{aligned}
|1^4|_{mod_{17}} &= 1,\\
|4^4|_{mod_{17}} &= |16^2|_{mod_{17}}=|256|_{mod_{17}}=1\\
|16^4|_{mod_{17}} &= |256^2|_{mod_{17}}=1^2=1\\
|13^4|_{mod_{17}} &= |169^2|_{mod_{17}}=|16^2|_{mod_{17}}=1
\end{aligned}
$$

With what we learned so far, we can now formally define the *embedding degree* as the smallest integer $k$ such that $\mathbb{G}_T\subset \mathbb{F}^*_{q^k}$ (that is the $k$th extension field over $\mathbb{F}_q$ without zero).
This is equivalent to being the smallest $k$ such that $r$ divides $q^k - 1$.

### Twists

Now we have $\mathbb{G}_1$ and $\mathbb{G}_T$, but we still need $\mathbb{G}_2$.
This group is required to be a group of elliptic curve points on $E$ of the same order as $\mathbb{G}_1$ and $\mathbb{G}_T$.

As it turns out, our group of curve points $E(\mathbb{F}_q)$ has only *one* group of order $r$, the group we use as $\mathbb{G}_1$.

But the group $E(\mathbb{F}_{q^{12}})$ does have such a subgroup $\mathbb{G}_2$ of order $r$
$$
\mathbb{G}_2 \subset E(\mathbb{F}_{q^{12}}): y^2 = x^3 + 4
$$

In this case the coordinates $(x,y)$ of the curve points are in $\mathbb{F}_{q^{12}}$

$$
(x,y) = ((x_0, x_1, ..., x_{11}),(y_0, y_1, ..., y_{11})) \in \mathbb{F}_{q^{12}}\times \mathbb{F}_{q^{12}}
$$

The problem that we are facing now, is that doing any kind of arithmetic with points in $\mathbb{F}_{q^{12}}\times\mathbb{F}_{q^{12}}$ is so cumbersome and computationally intensive (not to mention the huge amount of memory needed for storage) that we would like to avoid this.
And that is what we need twists for.

A *twist* can be seen as a function that maps points from one elliptic curve $E$ to points on another curve $E'$.
In our case we will use a *sextic twist* which will reduce the field of the coordinates of points on $E$ from $\mathbb{F}_{q^{12}}$ by a factor of six to $\mathbb{F}_{q^2}$ for points on $E'$:

$$
E'(\mathbb{F}_{q^2}): y^2 = x^3 +4(1+i)\textrm{, with }i^2 + 1 = 0
$$

The points in $E'(\mathbb{F}_{q^2})$ are much easier to handle compared to points in $E(\mathbb{F}_{q^{12}})$ and $E'$ also has a subgroup of order $r$ which maps to our previous group $\mathbb{G}_2$.

This means that for easier arithmetic we can use that subgroup of $E'(\mathbb{F}_{q^2})$ as our group $\mathbb{G}_2$ and map the points back to $E(\mathbb{F}_{q^{12}})$ only when needed.

## Summary

BLS12-381 is a pairing friendly elliptic curve with an embedding degree of 12.
The coordinates of points on that curve are elements of the finite field $\mathbb{F}_q$ and its extension fields.

The groups of order $r$ that we use for pairing $e: \mathbb{G}_1 \times \mathbb{G}_2 = \mathbb{G}_T$ are
- $\mathbb{G}_1$ which is a subset of the curve
$$
\mathbb{G}_1\subset E(\mathbb{F}_q):y^2 = x^3 + 4
$$
- $\mathbb{G}_2$ which is a subset of the curve
$$
\mathbb{G}_2\subset E'(\mathbb{F}_{q^2}):y^2 = x^3 + 4(1+i)
$$
- $\mathbb{G}_T$ which is the group of $r$th roots of unity in $\mathbb{F}_{q^{12}}$.

[^1]: Note that this is **not** the point at $(0,0)$.

[^2]: This is not the same as our curve being *defined over* $\mathbb{F}_q$.
Generally speaking, an elliptic curve of the form $E: y^2 = x^2 + ax + b$ is said to be *defined over a field $K$* if the parameters $a$ and $b$ are in $K$ but not necessarily the coordinates $x$ and $y$.
This is denoted by $E/K$.
In the case of BLS12-381 however, the curve is both defined over the field $\mathbb{F}_q$ (so $E/\mathbb{F}_q$) **and** has coordinates in the field $\mathbb{F}_q$ (so $E(\mathbb{F}_q)$).

[^3]: This is a direct consequence of <a href="https://en.wikipedia.org/wiki/Lagrange's_theorem_%28group_theory%29" target="_blank">Lagrange's Theorem</a>.

[^4]: Check the <a href="https://docs.rs/dusk-bls12_381/0.10.0/dusk_bls12_381/notes/design/index.html" target="_blank">crate documentation</a> on how the generator is chosen.

[^5]: In order to ease the arithmetics with `BlsScalar` we still do some tricks under the hood.
So even though `BlsScalar` essentially are just integers from $0$ to $r-1$, internally we multiply them with $2^{64}$ and take the resulting number modulo $r$.
This is called the Montgomery form of the `BlsScalar` and to add to the complexity we store that scalar in its Montgomery form the other way round (i.e. in little endian).

[^6]: Depending on what the pairing scheme is used for, $\mathbb{G}$ can also be set to $\mathbb{G}_2$ instead of $\mathbb{G}_1$.

[^7]: This is due to the fact that there are no irreducible polynomials with a degree $>1$ over the complex numbers and what that means is explained rather nicely <a href="https://hackmd.io/@benjaminion/bls12-381" target="_blank">here</a>.

[^8]: Indeed the curve has been specifically designed to have an embedding degree of 12, which is a compromise between security (the higher the better) and performance (the lower the better).