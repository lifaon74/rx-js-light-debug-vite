Scenarios:

- Alice wants to exchange 100$ (out) for 100€ (in)
  - Bob computes Alice's reputation (1)
  - if Alice's reputation is greater than $threshold (2), then Bob accepts this offer
  - Alice computes Bob's reputation (1)
  - if Bob's reputation is greater than $threshold (2), then Alice accepts the transaction
    - CASE 1: Alice sends 100$, Bob send 100€
      - Alice's trust in Bob increase
      - Bob's trust in Alice increase
    - CASE 2: Alice sends 0$, Bob send 100€
      - Alice's trust in Bob doesn't change
      - Bob's trust in Alice decrease


----

Trusts score:

Should I trust A:
- (1) compute own trust for A
- (2) compute peers trust for A


(1) compute own trust for A:
- transaction: { weight, score ∈ [0, 1] }
  - weight: how much 'costs' my transaction
  - score: how much my transaction is fulfilled
- sum of transactions: total_score = sum(transaction[i].weight


