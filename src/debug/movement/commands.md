

# List of commands

write:

```txt
=> [CMD_ID: u8, ...CMD_BYTES: u8[]]
```


read:

```txt
=> [CMD_ID: u8, RESPONSE_ID: u8, ...CMD_BYTES: u8[]]
<= [RESPONSE_ID: u8, ...RESPONSE_BYTES: u8[]]
```


## Single axis

### Set micro-stepping

```txt
=> [CMD_ID: u8, microsteps: u8]
```


### Perform Movement

```txt
=> [CMD_ID: u8, duration: f32, jerk: f32, acceleration: f32, velocity: f32, distance: f32]
// => 21B (@4Mhz => ~23Kmov/s)
```


## Multi axis (controller)

### Set micro-stepping

```txt
[CMD_ID: u8, ...microsteps: u8[]]
```

### Perform Movement

```txt
[CMD_ID: u8, duration: f32, jerk: f32, acceleration: f32, velocity: f32, ...distances: f32[]]
```

