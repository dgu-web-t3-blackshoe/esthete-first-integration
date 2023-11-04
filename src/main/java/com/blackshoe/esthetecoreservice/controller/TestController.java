package com.blackshoe.esthetecoreservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("core")
public class TestController {
    @GetMapping("/test")
    String test() {
        return "coreTest";
    }
}
